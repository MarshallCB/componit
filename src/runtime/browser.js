import { render, html, svg } from 'uhtml';
import { transformDefinition } from './iso.js'
let css = String.raw

function raw(str){
  var template = document.createElement('template')
  template.innerHTML = str;
  return template.content;
}
// TODO: Attach handler on fresh render
// TODO: componit should default export for SSR, but other than that, inner should be separate
// IF inner() is exported PER component, that definition could be shared across handler AND fresh render
let makeElement = (def, props) => {
  let el = document.createElement(def.tag);
  el.props = props;
  Object.keys(def.attributes).forEach(k => {
    // todo: some of these should be properties of the el, like .value and such
    el.setAttribute(k, def.attributes[k])
  })
  if(def.inner){
    render(el, def.inner.call(def, props));
  }
  return el;
}

let createComponent = (id, definition) => (props) => {
  let def = transformDefinition(id, {
    tag: `it-${id}`, // Default to custom-element
    attributes: {}, // Default to non-null object
    ...definition
  }, props)
  return makeElement(def, props)
}

export default createComponent
export { html, svg, raw, css, render }