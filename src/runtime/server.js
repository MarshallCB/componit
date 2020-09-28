import { html, raw, svg } from 'ucontent'
import { transformDefinition } from './iso.js'

let render = ({ attributes, tag, inner }, props) => html`
  ${raw`
    <${tag} ${Object.keys(attributes).map(k => raw`${k}="${attributes[k]}"`).join(" ") }> 
  `}
    ${ inner.call({ html, svg }, props, { html, svg }) }
  ${raw`
    </${tag}>
  `}
`.min()

let ssr = (id, definition) => (props) => {
  let def = transformDefinition(id, definition, props)
  return render(def, props)
}

ssr.handler = ()=>{}

export default ssr