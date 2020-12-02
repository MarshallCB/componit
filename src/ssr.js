import { html, raw, svg, css } from 'uline'

let render = html.bind(null)
render.svg = svg.bind(null)
render.html = html.bind(null)

export { render, html, css, raw, svg };