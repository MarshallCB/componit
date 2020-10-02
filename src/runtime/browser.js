import { render, html, svg } from 'uhtml';
import { transformDefinition } from './iso.js'

function raw(str){
  var template = document.createElement('template')
  template.innerHTML = str;
  return template.content;
}
// TODO: Attach handler on fresh render
// TODO: componit should default export for SSR, but other than that, inner should be separate
// IF inner() is exported PER component, that definition could be shared across handler AND fresh render
let makeElement = ({ attributes, tag, inner }, props) => {
  let el = document.createElement(tag);
  el.props = props;
  Object.keys(attributes).forEach(k => {
    // todo: some of these should be properties of the el, like .value and such
    el.setAttribute(k, attributes[k])
  })
  render(el, inner.call({ html, svg, raw }, props));
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
export let runtime = { html, svg, raw }

/*
  html() { return render(this.element, html.apply(null, arguments)); },
  svg() { return render(this.element, svg.apply(null, arguments)); },
  raw(str){
    var template = document.createElement('template')
    template.innerHTML = str;
    return template.content;
  },
*/