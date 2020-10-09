var {nodeResolve} = require('@rollup/plugin-node-resolve')
var path = require('path')
var { rollup } = require('rollup')
var { terser } = require('rollup-plugin-terser')
var replace = require('@rollup/plugin-replace')
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
        fs.ensureFileSync(d)
        fs.writeFileSync(d, files[p])
      })
      console.log(`componit: generated ${ Object.keys(files).length } files`)
    }).catch(e => console.log(e))
  }

  async browserComponit(){
    let browser_bundle = await rollup({
      input: path.join(__dirname, './runtime/browser.js'),
      output: "y",
      cache: false,
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

  async browserSaturation(sources){
    let handlerIds = []
    sources.forEach(({name, p}) => {
      delete require.cache[p]
      let m = require(p)
      if(m.handler){
        handlerIds.push(name)
      } 
    })
    let browser_bundle = await rollup({
      input: path.join(__dirname, './runtime/auto-saturate.js'),
      output: "z",
      cache: false,
      plugins: [
        nodeResolve(),
        ...(this.minify ? [terser()] : []),
        replace({
          __handler_id_array__: `[${handlerIds.map(n => `'${n}'`).join(",")}]`
        })
      ],
      external(id){
        return id.includes('componit')
      }
    })
    let { output } = await browser_bundle.generate({
      format: "iife"
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

  renderBundle(sources){
    let components = {}
    // let source = this.source
    sources.forEach(({name, p}) => {
      let virtual_snippet
      delete require.cache[p]
      let m = require(p)
      if (m.default){
        virtual_snippet = js`
        import ${name} from '${p}'
        export default ${name};      
      `.toString()
      } else {
        console.log("Generating empty component: " + name)
        virtual_snippet = js`
          export default ()=>{}
        `.toString()
      }
      components[name + "--render.js"] = virtual_snippet
    })
    return components;
  }
  handlerBundle(sources){
    let components = {}
    // let source = this.source
    sources.forEach(({name, p}) => {
      let virtual_snippet
      delete require.cache[p]
      let m = require(p)
      if(m.handler){
        if(m.handler.inner){
          virtual_snippet = js`
            import { handler } from '${p}'
            import { render } from 'componit'
            let original = handler.inner
            handler.inner = function(){
              render(this.element, original.apply(this, arguments))
            }
            export default handler;
          `.toString()
        } else {
          virtual_snippet = js`
            import { handler } from '${p}'
            export default handler;
          `.toString()
        }
      } else {
        virtual_snippet = js`
          export default ()=>{}
        `.toString()
      }
      components[`${name}--${name}-handler.js`] = virtual_snippet
    })

    return components;
  }
  elementBundle(sources){
    let components = {}
    // let source = this.source
    sources.forEach(({name, p}) => {
      let virtual_snippet
      delete require.cache[p]
      let m = require(p)
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
      components[`${name}--${name}-element.js`] = virtual_snippet
    })
    return components;
  }

  async bundleSingle(names, virtuals, file_name){
    let components = virtuals;
    let out = {}
    let rollup_bundle = await rollup({
      input: Object.keys(components),
      output: "componit_output",
      treeshake: {
        moduleSideEffects: false
      },
      cache: false,
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
      entryFileNames: ({name}) => `${name.replace("_virtual:","").split("--").join('/')}.js`
    })
    output.forEach(o => {
      let name = o.fileName
      out[name] = o.code.toString().replace(this.source,"")
    })
    return out;
  }

  async bundle(){
    if(!this.runtime){
      this.runtime = await this.browserComponit()
    }
    let names = this.getComponentNames()
    let sources = names.map(name => {
      // Clear require cache
      let p = path.join(this.source, name + ".js")
      delete require.cache[p]
      let m = require(p)
      return { m, name, p }
    })

    // let renders = await this.bundleSingle(this.renderBundle(sources))
    let elements = await this.bundleSingle(names, this.elementBundle(sources), "element.js")
    let handlers = await this.bundleSingle(names, this.handlerBundle(sources), "handler.js")
    let saturate = await this.browserSaturation(sources)

    // TODO: generate it.json based on hash values
    return {
      ...elements,
      ...handlers,
      'styles.css': this.generateStyles(),
      'it.js': saturate
    };
  }
}