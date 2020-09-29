import { render, html, svg } from 'uhtml';
import { transformDefinition } from './iso.js'

function raw(str){
  var template = document.createElement('template')
  template.innerHTML = str;
  return template.content;
}

let makeElement = ({ attributes, tag, inner }, props) => {
  let el = document.createElement(tag);
  el.props = props;
  Object.keys(attributes).forEach(k => {
    // todo: some of these should be properties of the el, like .value and such
    el.setAttribute(k, attributes[k])
  })
  render(el, inner.call({ html, svg, raw }, props, {html, svg, raw}));
  return el;
}

let browser = (id, definition) => (props) => {
  let def = transformDefinition(id, definition, props)
  return makeElement(def, props)
}

window.html = html;
window.render = render;
window.svg = svg;

export default browser