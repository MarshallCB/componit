import { render, html, svg } from 'uhtml';
import css from 'plain-tag'
import { define, defineAsync, upgrade } from 'wicked-elements'

let definitions = __handlers__

Object.keys(definitions).forEach(it => defineAsync(`.${it},${it},[is="${it}"]`, () => import(definitions[it])) )

function renderProxy(fn){
  return function(){
    let result = fn.apply(null,arguments)
    upgrade(result)
    return result
  }
}
html.element = renderProxy(html.node)
svg.element = renderProxy(html.node)

function raw(str){
  var template = document.createElement('template')
  template.innerHTML = str;
  return template.content;
}

Object.assign(window, {
  upgrade, render, html, svg, raw, css, define
})

export { render, html, svg, raw, css, define }