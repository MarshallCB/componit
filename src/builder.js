var {nodeResolve} = require('@rollup/plugin-node-resolve')
var path = require('path')
var { rollup } = require('rollup')
var { terser } = require('rollup-plugin-terser')
var virtual = require('@rollup/plugin-virtual')
var { js } = require('ucontent')
var chokidar = require('chokidar')
var load_config = require('./config.js');
const fs = require('fs-extra')

// TODO: ensure .js on imports for browser
// TODO: ensure runtime is included for saturation that needs it (oof!)

module.exports = class Componit{
  constructor(){
    let { source, destination, browser_runtime_path, builds } = load_config()
    this.source = source
    this.destination = destination
    this.browser_runtime_path = browser_runtime_path
    this.runtime = null
    this.builds = builds;
  }

  watch(){
    console.log("todo")
  }

  build(){
    Promise.resolve(this.bundle()).then(files => {
      Object.keys(files).forEach(p => {
        fs.ensureDirSync(this.destination)
        fs.writeFileSync(path.join(this.destination, p), files[p])
      })
    })
  }

  async virtualBrowser(){
    let browser_bundle = await rollup({
      input: this.browser_runtime_path,
      output: "y",
      plugins: [
        nodeResolve(),
        terser()
      ]
    })
    let { output } = await browser_bundle.generate({
      format: "esm"
    })
    return output[0].code
  }

  async bundle(){

    if(!this.runtime){
      this.runtime = await this.virtualBrowser()
    }

    let source = this.source

    let names = fs.readdirSync(this.source).map(n => {
      n = n.replace(this.source, "")
      n = n.replace(".js","")
      return n;
    }).filter(name => !name.startsWith("_"))
    let out = {}

    await Promise.all(this.builds.map(async b => {
      let { transports, minify, external, extension } = {
        transports: 'default',
        minify: true,
        extension:".js",
        external(id,parent){
          if(id.startsWith('.') && parent.includes(source) && !path.basename(id).startsWith("_")){
            return true;
          }
          return false;
        },
        ...b
      }
      let components = {}
      names.forEach(name => {
        let m = require(path.join(this.source, name))
        let valid = (Array.isArray(transports) ? transports : [transports]).every(k => Object.keys(m).includes(k))
        if(valid){
          let imported, exported;
          if(Array.isArray(transports)){
            let dIndex = transports.indexOf('default')
            if(dIndex != -1){
              // has a default at transports[dIndex]
              let d = transports.splice(dIndex, 1)
              imported = `${name}, { ${transports.join(', ')} }`
              exported = `export default ${name}; export { ${transports.join(', ')} }`
            } else {
              imported = `{ ${transports.join(', ')} }`
              exported = `export { ${transports.join(', ')} }`
            }
          } else {
            if(transports === 'default'){
              imported = name;
              exported = `export default ${name}`
            } else {
              imported = `{ ${transports} }`
              exported = `export default ${transports}`
            }
          }
          components[name] = js`
            import ${ imported } from '${ path.join(this.source, name + ".js") }'
            ${exported}
          `.toString()
        } else {
          // Prevent 404's
          components[name] =  js`
            export default ()=>{}
          `.toString()
        }
      })
      let rollup_bundle = await rollup({
        input: Object.keys(components),
        output: "componit_comps",
        treeshake: {
          moduleSideEffects: false
        },
        plugins: [
          virtual({
            ...components,
            componit: this.runtime || `export default ()=>{}`
          }),
          nodeResolve(),
          terser() // TODO: add minify option
        ],
        external
      })
      let { output } = await rollup_bundle.generate({
        format: "esm",
        chunkFileNames: ({name}) => `${name.replace("_virtual:","")}`,
        entryFileNames: ({name}) => `${name.replace("_virtual:","")}${extension}`,
        manualChunks(id){
          let a = names
          let i = a.findIndex(n => id.includes(n))
          let o = a[i] ? a[i] : "runtime.js"
          return o
        }
      })
      output.forEach(o => {
        let name = o.fileName
        out[name] = o.code.toString().replace(this.source,"")
      })

    }))
    return out;
  }
}