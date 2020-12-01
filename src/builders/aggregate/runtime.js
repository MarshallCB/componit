var { readFile, freshRequire, writeFile, rollup, bytesize, parseObject } = require('../../utils')
var path = require('path')
const rollupStream = require('@rollup/stream');
var replace = require('@rollup/plugin-replace')
const virtual = require('@rollup/plugin-virtual');
import { nodeResolve } from '@rollup/plugin-node-resolve';
const { minify } = require('terser')

let runtime_template

let terser_options = {}

export async function generateRuntime(targets){
  // Load template file
  let runtime_start = Date.now()
  if(!runtime_template){
    runtime_template = await readFile(path.join(__dirname, './_runtime-template.js'), 'utf8')
    runtime_template = await rollup({
      input: 'x',
      output: { format: 'esm' },
      plugins: [
        virtual({ x: runtime_template }),
        nodeResolve()
      ]
    })
    runtime_template = (await minify(runtime_template)).code
  }
  console.log('runtime: ' + (Date.now() - runtime_start)+'ms')
  let source = runtime_template.replace('__handlers__', generateHandlers(targets))
  return (await minify(source)).code
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