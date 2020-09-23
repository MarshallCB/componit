import { html, raw, svg } from 'ucontent'
import { transformDefinition } from './shared'

// Return HTML string for server-side rendering
export default (id, definition) => (props) => {
  let { attributes, tag, inner } = transformDefinition(id, definition, props)

  return html`
    ${raw`
      <${tag} 
        ${Object.keys(attributes).map(k => raw`${k}="${attributes[k]}"`).join(" ")
      }> 
    `}
    ${
      inner.call({ html, svg }, props)
    }
    ${raw`
      </${tag}>
    `}
  `
}