import { html, raw, svg, css } from 'ucontent'
import { transformDefinition } from './iso.js'

/* TODO: Watch for HTML solo tags (img, etc.) and handle differently */
let render = ({ attributes, tag, inner }, props) => html`
  ${raw`
    <${tag} ${Object.keys(attributes).map(k => raw`${k}="${attributes[k]}"`).join(" ") }> 
  `}
    ${ /* if inner is a function, call it. If it's not null, return raw value. Else, return empty string */
      typeof inner === 'function' ? inner.call({ attributes, tag }, props) : (inner ? inner : '')
    }
  ${raw`
    </${tag}>
  `}
`.min()

let ssr = (id, definition) => (props) => {
  let def = transformDefinition(id, definition, props)
  return render(def, props)
}

export default ssr
export { html, css, raw, svg };