import { html, raw, svg, css } from 'uline'

let render = html.bind(null)
render.svg = svg.bind(null)
render.html = html.bind(null)

let componit = x=>x

export { render, componit, html, css, raw, svg };