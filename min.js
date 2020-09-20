!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e(require("ucontent")):"function"==typeof define&&define.amd?define(["ucontent"],e):(t=t||self).componit=e(t.ucontent)}(this,(function(t){"use strict";return(e,n)=>a=>{let{attributes:o,tag:u,inner:i}=((t,e,n)=>{let a="function"==typeof e.tag?e.tag(n):e.tag,o="function"==typeof e.attributes?e.attributes(n):{...e.attributes},u=[];return o.class=`it-${t} ${o.className||""}`,delete o.className,Object.keys(o).forEach(t=>{u.push([t,o[t]])}),{...e,attributes:u,tag:a}})(e,n,a);return t.html`
    ${t.raw`
      <${u} 
        ${o.map(([e,n])=>t.raw`${e}="${n}"`).join(" ")}> 
    `}
    ${i.call({html:t.html,svg:t.svg},a)}
    ${t.raw`
      </${u}>
    `}
  `}}));
