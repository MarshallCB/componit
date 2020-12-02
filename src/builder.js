var path = require('path')
var jeye = require('jeye')
require = require("esm")(module)
var { generateStyles } = require('./builders/aggregate/style')
var { generateRuntime } = require('./builders/aggregate/runtime')
var { generateRender } = require('./builders/single/render')
var { generateStyle } = require('./builders/single/style')
const { writeFile, readFile, bytesize } = require('./utils')
var { blue, green, bold, underline, cyan, magenta, dim } = require('kleur')
const { generateHandler } = require('./builders/single/handler')


// TODO: different runtimes for each build type

let jeye_options = { ignore: /(^|[\/\\])[\._]./, cache: require.cache }

module.exports = class Componit{
  constructor(source, output, debug){
    this.source = source
    this.output = output;
    this.minify = !debug;
  }

  watch(){
    this.build()
    jeye.watch(this.source, jeye_options)
      .on("change", async (p, info, changed) => {
        this.loadStart = Date.now()
        await this.single(p, info)
      })
      .on("aggregate", async (targets, changed) => {
        await this.aggregate(targets)
      })
  }

  async write(id, data){
    await writeFile(path.join(this.output, id), data)
  }

  async single(p, info){
    let [ render, style, handler ] = await Promise.all([
      generateRender(p, info),
      generateStyle(p, info),
      generateHandler(p, info)
    ])
    await Promise.all([
      this.write(info.id, render),
      this.write(info.id.replace('.js','/render.js'), render),
      this.write(info.id.replace('.js','/style.css'), style),
      this.write(info.id.replace('.js','/handler.js'), handler)
    ])

    // this.prettyPrint({
    //   title: path.basename(p),
    //   details: [
    //     { label: "Render", content: bytesize(render) },
    //     { label: "Style", content: bytesize(style) },
    //     { label: "Handler", content: bytesize(handler) }
    //   ]
    // })

  }

  prettyPrint({ title, details }){
    if(!this.silent){
      console.log(`${blue('ᕳXᕲ')} ${bold(title)} ${
        details.map(({label, content}) =>
          `${dim(label)} ${green().bold(content)}`
        ).join(" ")
      }`)
    }
  }

  async aggregate(targets){
    
    let [ styles, runtime ] = await Promise.all([
      generateStyles(targets),
      generateRuntime(targets)
    ])
    await Promise.all([
      this.write('styles.css', styles),
      this.write('runtime.js', runtime)
    ])

    this.prettyPrint({
      title: `it (${blue(Object.keys(targets).length)})`,
      details: [
        { label: "runtime.js", content: bytesize(runtime) },
        { label: "styles.css", content: bytesize(styles) },
        { label: "duration", content: Date.now() - this.loadStart + 'ms' }
      ]
    })

  }

  async build(){
    let targets = await jeye.targets(this.source, jeye_options)
    this.loadStart = Date.now()
    await Promise.all([
      ...Object.keys(targets).map(async p => {
        await this.single(p, targets[p])
      }),
      this.aggregate(targets)
    ])
  }

}