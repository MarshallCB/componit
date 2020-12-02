import { html, raw, svg, css } from 'uline'

html.element = html.bind(null)
svg.element = svg.bind(null)

export { html, css, raw, svg };