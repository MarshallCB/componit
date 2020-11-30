var { freshRequire, parseObject } = require('../../utils')
var { minify } = require('terser')

export async function generateHandler(p, info){
  let { handler, it} = freshRequire(p)
  if(handler && it){
    let { code } = await minify(`
      export let it="${it}";
      export let handler=${parseObject(handler)};
    `)
    return code;
  }
  return `export let it="${it}"; export let handler={};`;
}