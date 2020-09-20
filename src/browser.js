import { html, svg } from 'uhtml';
import { transformDefinition } from './utils'

// Return saturated node for browser-side rendering
export default (id, definition) => (props) => {
  let { attributes, tag, inner } = transformDefinition(id, definition, props)

  let el = document.createElement(tag);
  el.props = props;
  attributes.forEach( ([ name, value ]) => {
    el.setAttribute(name, value)
  })
  render(el, inner.call({ html, svg }, props));
  return el;
}