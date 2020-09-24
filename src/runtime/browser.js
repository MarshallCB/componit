import { render, html, svg } from 'uhtml';
import { transformDefinition } from './iso.js'

let makeElement = ({ attributes, tag, inner }, props) => {
  let el = document.createElement(tag);
  el.props = props;
  Object.keys(attributes).forEach(k => {
    // todo: some of these should be properties of the el, like .value and such
    el.setAttribute(k, attributes[k])
  })
  render(el, inner.call({ html, svg }, props));
  return el;
}

let browser = (id, definition) => (props) => {
  let def = transformDefinition(id, definition, props)
  return makeElement(def, props)
}

browser.handler = ()=>{}

window.html = html;
window.render = render;
window.svg = svg;

export default browser