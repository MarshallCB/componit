import { html, raw, svg } from 'ucontent'
import { transformDefinition } from './utils'

// Return HTML string for server-side rendering
export default (id, definition) => (props) => {
  let { attributes, tag, inner } = transformDefinition(id, definition, props)

  return html`
    ${raw`
      <${tag} 
        ${attributes.map( ([name,value]) => raw`${name}="${value}"`).join(" ")
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