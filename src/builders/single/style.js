var { freshRequire } = require('../../utils')
var { writeFile } = require('../../utils')
var csso = require('csso')

export async function generateStyle(p, info){
    let m = freshRequire(p)
    let style = m.style ? m.style.toString() : ""
    return csso.minify(style).css
}