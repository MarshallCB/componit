var { readFile, freshRequire, writeFile, rollup, bytesize, parseObject } = require('../../utils')
var path = require('path')
const rollupStream = require('@rollup/stream');
var { terser } = require('rollup-plugin-terser')
var replace = require('@rollup/plugin-replace')
const virtual = require('@rollup/plugin-virtual');
import { nodeResolve } from '@rollup/plugin-node-resolve';

let runtime_template

let terser_options = {}

export async function generateRuntime(targets){
  // Load template file
  if(!runtime_template){
    runtime_template = await readFile(path.join(__dirname, './_runtime-template.js'), 'utf8')
  }
  // Rollup and minify
  let code = await rollup({
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
        virt: runtime_template
      }),
      replace({
        __handlers__: generateHandlers(targets)
      }),
      nodeResolve(),
      terser()
    ]
  })
  return code;
}



function generateHandlers(targets){
  let handlers = {}
  Object.keys(targets).forEach(p => {
    let { handler, it} = freshRequire(p)
    if(handler && it){
      handlers[it] = handler;
    }
  })
  return parseObject(handlers)
}