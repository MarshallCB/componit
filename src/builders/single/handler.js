const virtual = require('@rollup/plugin-virtual');
const rollupStream = require('@rollup/stream');
var { skypin } = require('rollup-plugin-skypin');
const { pathDepth, rollup } = require('../../utils');
var path = require('path')
const { minify } = require('terser')

const local_componit = ({ id }) => ({
  async resolveId(dependency){
    if(!dependency.startsWith('.')){
      if(dependency === 'external-componit'){
        return {
          id: pathDepth(id) + 'runtime.js',
          external: true
        }
      }
    }
  }
})

let rollup_options = ({ contents, exports, id}) => {
  return {
    input: 'virt',
    output: { format: 'esm' },
    cache: false,
    treeshake: {
      moduleSideEffects: false,
      propertyReadSideEffects: false,
      unknownGlobalSideEffects: false
    },
    plugins: [
      virtual({
        virt: exports.includes('handler') && exports.includes('it') ? `export {handler, it} from 'it'` : 'export let handler={};export let it=null;',
        it: contents.toString('utf8'),
        componit: `
          import { html, svg, raw } from 'external-componit'
          let css = ()=>{}
          export { css, html, svg, raw }
        `
      }),
      local_componit({ id }),
      skypin({ 
        pinned: true,
        minified: true,
        relative_external: true,
        shouldReplace(module_id){
          return module_id !== 'componit'
        }
      })
    ]
  }
}

export async function generateHandler(p, info){
  let source = await rollup(rollup_options(info))
  return source //(await minify(source)).code
}