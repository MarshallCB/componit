import { render, html, svg } from 'uhtml';
import { define, defineAsync, upgrade } from 'wicked-elements'

let definitions = __handlers__
// Object.keys(definitions).forEach(it => define(`.${it},${it},[is="${it}"]`, definitions[it]))
Object.keys(definitions).forEach(it => defineAsync(`.${it},${it},[is="${it}"]`, () => import(definitions[it])) )

function renderProxy(fn){
  return function(){
    let result = fn.apply(null,arguments)
    upgrade(result)
    return result
  }
}
html.node = renderProxy(html.node)
svg.node = renderProxy(html.node)
let css = String.raw

function raw(str){
  var template = document.createElement('template')
  template.innerHTML = str;
  return template.content;
}

Object.assign(window, {
  upgrade, render, html, svg, raw, css
})

export { render, html, svg, raw, css }