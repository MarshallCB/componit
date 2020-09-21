import nodeResolve from '@rollup/plugin-node-resolve';
import fs from 'fs'
import { rollup } from 'rollup';
import { terser } from 'rollup-plugin-terser';
import { js } from 'ucontent'

// export default async function(names, dir){
//   let saturation = await saturationBundle(names);
//   let renders = await renderBundle(names);
//   return {
//     ...saturation, ...renders
//   }
// }

// async function saturationBundle(){
//   return await genericBundle({
//     ports: 'saturate',
//     minify: true,
//     external(id,parent){
//       let base = [
//         ...require('module').builtinModules,
//         ...Object.keys(pkg.dependencies || {}),
//         ...Object.keys(pkg.peerDependencies || {})
//       ]
//       if(id.startsWith('.') && parent.includes(path.join(process.cwd(), '/components'))){
//         return true;
//       }
//       return false;
//     },
//     format:"esm",
//     extension:".augm-it.js"
//   })
// }

export default (inputDir) => {
  
  return async function bundle(options){
    let { ports, componit, minify, external, format, extension } = {
      ports: 'default',
      componit: __virtual_componit__,
      minify: true,
      format:"esm",
      extension:".js",
      ...options
    }
    let names = fs.readdirSync(path.join(process.cwd(), inputDir)).map(n => {
      console.log(n)
      n = n.replace(process.cwd(), "")
      n = n.replace(inputDir, "")
      n = n.replace(".js","")
      console.log(n)
      return n;
    })
    let components = {}
    let out = {}
    names.forEach(n => {
      if(require(path.join(process.cwd(), inputDir))[ports]){
        components[n] = js`
          import ${ ports === 'default' ? n : `{ ${ports} }` } from './${inputDir}/${n}.js';
          export default ${ports === 'default' ? n : ports};
        `.toString()
      } else {
        components[n] =  js`
          export default ()=>{}
        `.toString()
      }
    })
    let bundle = await rollup({
      input: Object.keys(components),
      output: "componit_comps",
      plugins: [
        virtual({
          ...components,
          componit: componit || `export default ()=>{}`
        }),
        nodeResolve(),
        terser() // TODO: if minify option
      ],
      external
    })
    let { output } = await bundle.generate({
      format,
      chunkFileNames: ({name}) => `${name.replace("_virtual:","")}${extension}`,
      entryFileNames: ({name}) => `${name.replace("_virtual:","")}${extension}`
    })
    output.forEach(o => {
      let name = o.fileName.replace(".js","")
      let s = o.code.toString()
      // TODO: this is sketchy. better way to replace local component imports?
      let search = new RegExp(path.join(process.cwd(), inputDir), "g")
      s = s.replace(search,"")
      out[name] = s
    })
    return out;
  }
}

// async function genericBundle(names, component_dirname { ports, componit, minify, external, format, extension }){
//   let components = {}
//   let out = {}
//   names.forEach(n => {
//     if(require(path.join(process.cwd(), component_dirname))[ports]){
//       components[n] = js`
//         import ${ ports === 'default' ? n : `{ ${ports} }` } from './${component_dirname}/${n}.js';
//         export default ${ports === 'default' ? n : ports};
//       `.toString()
//     } else {
//       components[n] =  js`
//         export default ()=>{}
//       `.toString()
//     }
//   })
//   let bundle = await rollup({
//     input: Object.keys(components),
//     output: "componit_comps",
//     plugins: [
//       virtual({
//         ...components,
//         componit: componit || `export default ()=>{}`
//       }),
//       nodeResolve(),
//       terser() // TODO: if minify option
//     ],
//     external
//   })
//   let { output } = await bundle.generate({
//     format,
//     chunkFileNames: ({name}) => `${name.replace("_virtual:","")}${extension}`,
//     entryFileNames: ({name}) => `${name.replace("_virtual:","")}${extension}`
//   })
//   output.forEach(o => {
//     let name = o.fileName.replace(".js","")
//     let s = o.code.toString()
//     // TODO: this is sketchy. better way to replace local component imports?
//     let search = new RegExp(path.join(process.cwd(), component_dirname), "g")
//     s = s.replace(search,"")
//     out[name] = s
//   })
//   return out;
// }

// async function saturationBundle(componentNames){
//   let components = {}
//   let out = {}
//   componentNames.forEach(c => {
//     components[c] = require(`../components/${c}`).saturate ? js`
//       import { saturate } from './components/${c}.js';
//       export default saturate;
//     `.toString() : js`
//       export default ()=>{}
//     `.toString()
//   })
//   let bundle = await rollup({
//     input: Object.keys(components),
//     output: "comps",
//     plugins: [
//       virtual({
//         ...components,
//         componit: `export default ()=>{}`
//       }),
//       nodeResolve()
//     ],
//     external(id,parent){
//       let base = [
//         ...require('module').builtinModules,
//         ...Object.keys(pkg.dependencies || {}),
//         ...Object.keys(pkg.peerDependencies || {})
//       ]
//       if(id.startsWith('.') && parent.includes(path.join(process.cwd(), '/components'))){
//         return true;
//       }
//       return false;
//     }
//   })
//   let { output } = await bundle.generate({ 
//     format: "esm",
//     manualChunks(id){
//       let a = componentNames
//       let i = a.findIndex(n => id.includes(n))
//       let o = a[i] ? a[i] : "runtime"
//       return o
//     },
//     entryFileNames: ({name}) => `${name.replace("_virtual:","")}.augm-it.js`,
//     chunkFileNames: ({name}) => `${name.replace("_virtual:","")}.augm-it.js`
//   })
//   output.forEach(o => {
//     let name = o.fileName.replace(".js","")
//     let s = o.code.toString()
//     let search = new RegExp(path.join(process.cwd(), "/components"), "g")
//     s = s.replace(search,"")
//     out[name] = s
//   })
//   return out;
// }

// async function renderBundle(names){
//   return await genericBundle(names, {
//     ports: 'saturate',
//     componit: VIRTUAL_COMPONIT,
//     minify: true,
//     format:"esm",
//     extension:".js"
//   })
// }

// async function renderBundle(componentNames){
//   let components = {}
//   let out = {}
//   componentNames.forEach(c => {
//     components[c] = js`
//       import ${c} from './components/${c}.js';
//       export default ${c};
//     `.toString()
//   })
//   let bundle = await rollup({
//     input: Object.keys(components),
//     output: "comps",
//     plugins: [
//       virtual({
//         ...components,
//         componit: VIRTUAL_COMPONIT
//       }),
//       nodeResolve()
//     ]
//   })
//   let { output } = await bundle.generate({
//     format: "esm",
//     manualChunks(id){
//       let a = componentNames
//       let i = a.findIndex(n => id.includes(n))
//       let o = a[i] ? a[i] : "runtime"
//       return o
//     },
//     entryFileNames: ({name}) => `${name.replace("_virtual:","")}.js`,
//     chunkFileNames: "[name].js"
//   })
//   output.forEach(o => {
//     let name = o.fileName.replace(".js","")
//     out[name] = o.code.toString()
//   })
//   return out;
// }