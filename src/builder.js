var {nodeResolve} = require('@rollup/plugin-node-resolve')
var path = require('path')
var { rollup } = require('rollup')
var { terser } = require('rollup-plugin-terser')
var virtual = require('@rollup/plugin-virtual')
var { js, css, render } = require('ucontent')
var chokidar = require('chokidar')
const fs = require('fs-extra')

// TODO: different runtimes for each build type

module.exports = class Componit{
  constructor(input, output, debug){
    this.source = path.join(process.cwd(), input)
    this.destination = path.join(process.cwd(), output)
    this.runtime = null
    this.minify = !debug;
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
        console.log(d)
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

  getComponentNames(){
    return fs.readdirSync(this.source).map(n => {
      n = n.replace(this.source, "")
      n = n.replace(".js","")
      return n;
    }).filter(name => !name.startsWith("_") && !name.startsWith("."))
  }

  generateStyles(){
    let names = this.getComponentNames()
    let styledComponents = []

    names.forEach(name => {
      let p = path.join(this.source, name + ".js")
      delete require.cache[p]
      let m = require(p)
      if(m.style){
        styledComponents.push(m.style)
      }
    })
    return css(styledComponents.join(" ")).min().toString()

  }

  renderBundle(names){
    let components = {}
    // let source = this.source
    names.forEach(name => {
      // Clear require cache
      let p = path.join(this.source, name + ".js")
      delete require.cache[p]
      let m = require(p)
      let virtual_snippet
      if(m.default && m.handler){
        virtual_snippet = js`
          import ${name}, { handler } from '${p}'
          export default ${name};
          export { handler };        
        `.toString()
      } else if (m.default){
        virtual_snippet = js`
        import ${name} from '${p}'
        export default ${name};
        export let handler = ()=>{};        
      `.toString()
      } else {
        console.log("Generating empty component: " + name)
        virtual_snippet = js`
          export default ()=>{}
          export let handler = ()=>{}
        `.toString()
      }
      components[name + "--render.js"] = virtual_snippet
    })
    return components;
  }
  handlerBundle(names){
    let components = {}
    // let source = this.source
    names.forEach(name => {
      // Clear require cache
      let p = path.join(this.source, name + ".js")
      delete require.cache[p]
      let m = require(p)
      let virtual_snippet
      if(m.handler){
        virtual_snippet = js`
          import { handler } from '${p}'
          export default handler;        
        `.toString()
      } else {
        virtual_snippet = js`
          export default ()=>{}
        `.toString()
      }
      components[name + "--handler.js"] = virtual_snippet
    })
    return components;
  }
  elementBundle(names){
    let components = {}
    // let source = this.source
    names.forEach(name => {
      // Clear require cache
      let p = path.join(this.source, name + ".js")
      delete require.cache[p]
      let m = require(p)
      let virtual_snippet
      if(m.default){
        let ports = Object.keys(m)
        ports.splice(ports.indexOf('default'), 1)
        virtual_snippet = js`
          import ${name}, { ${ports.join(', ')} } from '${p}'
          export default ${name};
          export { ${ports.join(', ')} };        
        `.toString()
      } else {
        virtual_snippet = js`
          export default ()=>{}
        `.toString()
      }
      components[name + "--element.js"] = virtual_snippet
    })
    return components;
  }

  async bundleSingle(virtuals){
    let components = virtuals;
    let out = {}
    let rollup_bundle = await rollup({
      input: Object.keys(components),
      output: "componit_output",
      treeshake: {
        moduleSideEffects: false
      },
      plugins: [
        virtual({
          ...components,
          componit: this.runtime
        }),
        nodeResolve(),
        ...(this.minify ? [terser()] : [])
      ],
      external(id,parent){
        return false;
      }
    })
    let { output } = await rollup_bundle.generate({
      format: "esm",
      chunkFileNames: ({name}) => `${name.replace("_virtual:","")}.js`,
      entryFileNames: ({name}) => `${name.replace("_virtual:","").split("--").join('/')}.js`,
    })
    output.forEach(o => {
      let name = o.fileName
      out[name] = o.code.toString().replace(this.source,"")
    })
    return out;
  }

  async bundle(){
    if(!this.runtime){
      this.runtime = await this.virtualBrowser()
    }
    let names = this.getComponentNames()

    let renders = await this.bundleSingle(this.renderBundle(names))
    let handlers = await this.bundleSingle(this.handlerBundle(names))
    let elements = await this.bundleSingle(this.elementBundle(names))

    // TODO: generate it.json based on hash values

    return {
      ...renders,
      ...handlers,
      ...elements,
      'styles.css': this.generateStyles()
    };
  }
}