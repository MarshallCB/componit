var { freshRequire } = require('../../utils')
var { writeFile } = require('../../utils')
var csso = require('csso')

export async function generateStyles(targets){
  let styles = ""
  try{
    Object.keys(targets).forEach(p => {
      let m = freshRequire(p)
      if(m.style){
        styles += m.style.toString() || ""
      }
    })
    return csso.minify(styles).css
  } catch(e){
    console.log("componit: Error generating styles")
    console.log(e)
  }
}