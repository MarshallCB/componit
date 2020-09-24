var {nodeResolve} = require('@rollup/plugin-node-resolve')
var path = require('path')
var { rollup } = require('rollup')
var { terser } = require('rollup-plugin-terser')
var virtual = require('@rollup/plugin-virtual')
var { js } = require('ucontent')
var chokidar = require('chokidar')
const fs = require('fs-extra')

// TODO: different runtimes for each build type

module.exports = class Componit{
  constructor(source, destination, builds, long){
    this.source = source
    this.destination = destination
    this.runtime = null
    this.builds = builds;
    this.minify = !long;
  }

  watch(){
    this.build()
    this.watcher = chokidar.watch(this.source, {
      ignoreInitial: true
    })
    this.watcher.on('all', (e, p) => {
      this.build()
    })
  }

  build(){
    Promise.resolve(this.bundle()).then(files => {
      Object.keys(files).forEach(p => {
        let d = path.join(this.destination, p)
        fs.ensureFileSync(d)
        fs.writeFileSync(d, files[p])
      })
      console.log(`componit: generated ${ Object.keys(files).length } files`)
    })
  }

  async virtualBrowser(){
    let browser_bundle = await rollup({
      input: path.join(__dirname, './runtime/browser.js'),
      output: "y",
      plugins: [
        nodeResolve(),
        ...(this.minify ? [terser()] : [])
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
    }).filter(name => !name.startsWith("_") && !name.startsWith("."))
    let out = {}

    await Promise.all(this.builds.map(async b => {
      let { transports, minify, external, extension } = {
        transports: 'default',
        extension:".js",
        external(id,parent){
          return false;
        },
        ...b
      }
      let components = {}
      names.forEach(name => {
        let m = require(path.join(this.source, name))
        let ports = transports === '*' ? Object.keys(m) : transports
        let valid = (Array.isArray(ports) ? ports : [ports]).every(k => Object.keys(m).includes(k))
        if(valid){
          let imported, exported;
          if(Array.isArray(ports)){
            let dIndex = ports.indexOf('default')
            if(dIndex != -1){
              // has a default at ports[dIndex]
              let d = ports.splice(dIndex, 1)
              imported = `${name}, { ${ports.join(', ')} }`
              exported = `export default ${name}; export { ${ports.join(', ')} }`
            } else {
              imported = `{ ${ports.join(', ')} }`
              exported = `export { ${ports.join(', ')} }`
            }
          } else {
            if(ports === 'default'){
              imported = name;
              exported = `export default ${name}`
            } else {
              imported = `{ ${ports} }`
              exported = `export default ${ports}`
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
          ...(this.minify ? [terser()] : [])
        ],
        external
      })
      let { output } = await rollup_bundle.generate({
        format: "esm",
        chunkFileNames: ({name}) => `${name.replace("_virtual:","")}`,
        entryFileNames: ({name}) => `${name.replace("_virtual:","")}/${extension}`,
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