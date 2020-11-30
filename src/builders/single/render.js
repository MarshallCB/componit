const virtual = require('@rollup/plugin-virtual');
const rollupStream = require('@rollup/stream');
var { terser } = require('rollup-plugin-terser')
var { lookup, skypin } = require('skypin');
const { pathDepth, rollup } = require('../../utils');
var path = require('path')

const componit_dependencies = ({ id }) => ({
  async resolveId(dependency){
    if(!dependency.startsWith('.')){
      if(dependency === 'componit'){
        return {
          id: pathDepth(id) + 'componit.js',
          external: true
        }
      }
      return {
        id: await lookup(dependency),
        external: true
      }
    } else {
      return {
        id: dependency,
        external: true
      }
    }
  }
})

let rollup_options = (component, id) => {
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
        virt: `export {default} from 'it'`,
        it: component
      }),
      componit_dependencies({ id }),
      terser()
    ]
  }
}

export async function generateRender(p, { contents, id, exports }){
  return await rollup(rollup_options(contents.toString('utf8'), id))
}