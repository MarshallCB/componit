import fs from 'fs'
import { js } from 'ucontent'

let browserSrc = js`
import { render, html, svg } from 'uhtml';

function transformDefinition(id, def, props){
  let tag = typeof def.tag ===  'function' ? def.tag(props) : def.tag
  let attr = typeof def.attributes === 'function' ? def.attributes(props) : { ...def.attributes }
  let attributes = []
  attr.class = "it-" + id + " " + attr.className;
  delete attr.className
  Object.keys(attr).forEach(k => {
    attributes.push([k, attr[k]])
  })
  return { ...def, attributes, tag }
}

export default (id, definition) => (props) => {
  let { attributes, tag, inner } = transformDefinition(id, definition, props)

  let el = document.createElement(tag);
  el.props = props;
  attributes.forEach( ([ name, value ]) => {
    el.setAttribute(name, value)
  })
  render(el, inner.call({ html, svg }, props));
  return el;
}
`.min().toString()

export default async function(names, dir){
  let saturation = await saturationBundle(names);
  let renders = await renderBundle(names);
  return {
    ...saturation, ...renders
  }
}

async function saturationBundle(componentNames){
  let components = {}
  let out = {}
  componentNames.forEach(c => {
    components[c] = require(`../components/${c}`).saturate ? js`
      import { saturate } from './components/${c}.js';
      export default saturate;
    `.toString() : js`
      export default ()=>{}
    `.toString()
  })
  let bundle = await rollup({
    input: Object.keys(components),
    output: "comps",
    plugins: [
      virtual({
        ...components,
        componit: `export default ()=>{}`
      }),
      nodeResolve()
    ],
    external(id,parent){
      let base = [
        ...require('module').builtinModules,
        ...Object.keys(pkg.dependencies || {}),
        ...Object.keys(pkg.peerDependencies || {})
      ]
      if(id.startsWith('.') && parent.includes(path.join(process.cwd(), '/components'))){
        return true;
      }
      return false;
    }
  })
  let { output } = await bundle.generate({ 
    format: "esm",
    entryFileNames: ({name}) => `${name.replace("_virtual:","")}.augm-it.js`,
    chunkFileNames: ({name}) => `${name.replace("_virtual:","")}.augm-it.js`
  })
  output.forEach(o => {
    let name = o.fileName.replace(".js","")
    let s = o.code.toString()
    let search = new RegExp(path.join(process.cwd(), "/components"), "g")
    s = s.replace(search,"")
    out[name] = s
  })
  return out;
}

async function renderBundle(componentNames){
  let components = {}
  let out = {}
  componentNames.forEach(c => {
    components[c] = js`
      import ${c} from './components/${c}.js';
      export default ${c};
    `.toString()
  })
  let bundle = await rollup({
    input: Object.keys(components),
    output: "comps",
    plugins: [
      virtual({
        ...components,
        componit: browserSrc
      }),
      nodeResolve()
    ]
  })
  let { output } = await bundle.generate({
    format: "esm",
    manualChunks(id){
      let a = componentNames
      let i = a.findIndex(n => id.includes(n))
      let o = a[i] ? a[i] : "runtime"
      return o
    },
    entryFileNames: ({name}) => `${name.replace("_virtual:","")}.js`,
    chunkFileNames: "[name].js"
  })
  output.forEach(o => {
    let name = o.fileName.replace(".js","")
    out[name] = o.code.toString()
  })
  return out;
}