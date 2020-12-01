var e=e=>({get:t=>e.get(t),set:(t,n)=>(e.set(t,n),n)});const t=/([^\s\\>"'=]+)\s*=\s*(['"]?)$/,n=/^(?:area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr)$/i,r=/<[a-z][^>]+$/i,l=/>[^<>]*$/,o=/<([a-z]+[a-z0-9:._-]*)([^>]*?)(\/>)/gi,s=/\s+$/,i=(e,t)=>0<t--&&(r.test(e[t])||!l.test(e[t])&&i(e,t)),a=(e,t,r)=>n.test(t)?e:`<${t}${r.replace(s,"")}></${t}>`;const{isArray:c}=Array,{indexOf:u,slice:d}=[],h=(e,t)=>111===e.nodeType?1/t<0?t?(({firstChild:e,lastChild:t})=>{const n=document.createRange();return n.setStartAfter(e),n.setEndAfter(t),n.deleteContents(),e})(e):e.lastChild:t?e.valueOf():e.firstChild:e;
/*! (c) Andrea Giammarchi - ISC */
var f=function(e){var t="content"in r("template")?function(e){var t=r("template");return t.innerHTML=e,t.content}:function(e){var t=r("fragment"),l=r("template"),o=null;if(/^[^\S]*?<(col(?:group)?|t(?:head|body|foot|r|d|h))/i.test(e)){var s=RegExp.$1;l.innerHTML="<table>"+e+"</table>",o=l.querySelectorAll(s)}else l.innerHTML=e,o=l.childNodes;return n(t,o),t};return function(e,n){return("svg"===n?l:t)(e)};function n(e,t){for(var n=t.length;n--;)e.appendChild(t[0])}function r(t){return"fragment"===t?e.createDocumentFragment():e.createElementNS("http://www.w3.org/1999/xhtml",t)}function l(e){var t=r("fragment"),l=r("div");return l.innerHTML='<svg xmlns="http://www.w3.org/2000/svg">'+e+"</svg>",n(t,l.firstChild.childNodes),t}}(document);const p=({childNodes:e},t)=>e[t],g=e=>{const t=[];let{parentNode:n}=e;for(;n;)t.push(u.call(n.childNodes,e)),n=(e=n).parentNode;return t},{createTreeWalker:m,importNode:b}=document,v=1!=b.length,w=v?(e,t)=>b.call(document,f(e,t),!0):f,y=v?e=>m.call(document,e,129,null,!1):e=>m.call(document,e,129),C=(e,t,n)=>((e,t,n,r,l)=>{const o=n.length;let s=t.length,i=o,a=0,c=0,u=null;for(;a<s||c<i;)if(s===a){const t=i<o?c?r(n[c-1],-0).nextSibling:r(n[i-c],0):l;for(;c<i;)e.insertBefore(r(n[c++],1),t)}else if(i===c)for(;a<s;)u&&u.has(t[a])||e.removeChild(r(t[a],-1)),a++;else if(t[a]===n[c])a++,c++;else if(t[s-1]===n[i-1])s--,i--;else if(t[a]===n[i-1]&&n[c]===t[s-1]){const l=r(t[--s],-1).nextSibling;e.insertBefore(r(n[c++],1),r(t[a++],-1).nextSibling),e.insertBefore(r(n[--i],1),l),t[s]=n[i]}else{if(!u){u=new Map;let e=c;for(;e<i;)u.set(n[e],e++)}if(u.has(t[a])){const l=u.get(t[a]);if(c<l&&l<i){let o=a,d=1;for(;++o<s&&o<i&&u.get(t[o])===l+d;)d++;if(d>l-c){const o=r(t[a],0);for(;c<l;)e.insertBefore(r(n[c++],1),o)}else e.replaceChild(r(n[c++],1),r(t[a++],-1))}else a++}else e.removeChild(r(t[a++],-1))}return n})(e.parentNode,t,n,h,e),$=(e,t)=>"ref"===t?(e=>t=>{"function"==typeof t?t(e):t.current=e})(e):"aria"===t?(e=>t=>{for(const n in t){const r="role"===n?n:"aria-"+n,l=t[n];null==l?e.removeAttribute(r):e.setAttribute(r,l)}})(e):".dataset"===t?(({dataset:e})=>t=>{for(const n in t){const r=t[n];null==r?delete e[n]:e[n]=r}})(e):"."===t.slice(0,1)?((e,t)=>n=>{e[t]=n})(e,t.slice(1)):"on"===t.slice(0,2)?((e,t)=>{let n,r=t.slice(2);return!(t in e)&&t.toLowerCase()in e&&(r=r.toLowerCase()),t=>{const l=c(t)?t:[t,!1];n!==l[0]&&(n&&e.removeEventListener(r,n,l[1]),(n=l[0])&&e.addEventListener(r,n,l[1]))}})(e,t):((e,t)=>{let n,r=!0;const l=document.createAttributeNS(null,t);return t=>{n!==t&&(n=t,null==n?r||(e.removeAttributeNode(l),r=!0):(l.value=t,r&&(e.setAttributeNodeNS(l),r=!1)))}})(e,t);function x(e){const{type:t,path:n}=e,r=n.reduceRight(p,this);return"node"===t?(e=>{let t,n,r=[];const l=o=>{switch(typeof o){case"string":case"number":case"boolean":t!==o&&(t=o,n?n.textContent=o:n=document.createTextNode(o),r=C(e,r,[n]));break;case"object":case"undefined":if(null==o){t!=o&&(t=o,r=C(e,r,[]));break}if(c(o)){t=o,0===o.length?r=C(e,r,[]):"object"==typeof o[0]?r=C(e,r,o):l(String(o));break}"ELEMENT_NODE"in o&&t!==o&&(t=o,r=C(e,r,11===o.nodeType?d.call(o.childNodes):[o]))}};return l})(r):"attr"===t?$(r,e.name):(e=>{let t;return n=>{t!=n&&(t=n,e.textContent=null==n?"":n)}})(r)}const N=e(new WeakMap),k=(e,n)=>{const r=((e,n,r)=>{const l=[],{length:s}=e;for(let r=1;r<s;r++){const o=e[r-1];l.push(t.test(o)&&i(e,r)?o.replace(t,(e,t,l)=>`${n}${r-1}=${l||'"'}${t}${l?"":'"'}`):`${o}\x3c!--${n}${r-1}--\x3e`)}l.push(e[s-1]);const c=l.join("").trim();return r?c:c.replace(o,a)})(n,"isµ","svg"===e),l=w(r,e),s=y(l),c=[],u=n.length-1;let d=0,h="isµ"+d;for(;d<u;){const e=s.nextNode();if(!e)throw"bad template: "+r;if(8===e.nodeType)e.textContent===h&&(c.push({type:"node",path:g(e)}),h="isµ"+ ++d);else{for(;e.hasAttribute(h);)c.push({type:"attr",path:g(e),name:e.getAttribute(h)}),e.removeAttribute(h),h="isµ"+ ++d;/^(?:style|textarea)$/i.test(e.tagName)&&e.textContent.trim()===`\x3c!--${h}--\x3e`&&(e.textContent="",c.push({type:"text",path:g(e)}),h="isµ"+ ++d)}}return{content:l,nodes:c}},E=(e,t)=>{const{content:n,nodes:r}=N.get(t)||N.set(t,k(e,t)),l=b.call(document,n,!0);return{content:l,updates:r.map(x,l)}},A=(e,{type:t,template:n,values:r})=>{const{length:l}=r;O(e,r,l);let{entry:o}=e;o&&o.template===n&&o.type===t||(e.entry=o=((e,t)=>{const{content:n,updates:r}=E(e,t);return{type:e,template:t,content:n,updates:r,wire:null}})(t,n));const{content:s,updates:i,wire:a}=o;for(let e=0;e<l;e++)i[e](r[e]);return a||(o.wire=(e=>{const{childNodes:t}=e,{length:n}=t;if(n<2)return n?t[0]:e;const r=d.call(t,0);return{ELEMENT_NODE:1,nodeType:111,firstChild:r[0],lastChild:r[n-1],valueOf(){if(t.length!==n){let t=0;for(;t<n;)e.appendChild(r[t++])}return e}}})(s))},O=({stack:e},t,n)=>{for(let r=0;r<n;r++){const n=t[r];n instanceof S?t[r]=A(e[r]||(e[r]={stack:[],entry:null,wire:null}),n):c(n)?O(e[r]||(e[r]={stack:[],entry:null,wire:null}),n,n.length):e[r]=null}n<e.length&&e.splice(n)};function S(e,t,n){this.type=e,this.template=t,this.values=n}const{create:M,defineProperties:L}=Object,T=t=>{const n=e(new WeakMap);return L((e,...n)=>new S(t,e,n),{for:{value(e,r){const l=n.get(e)||n.set(e,M(null));return l[r]||(l[r]=(e=>(n,...r)=>A(e,{type:t,template:n,values:r}))({stack:[],entry:null,wire:null}))}},node:{value:(e,...n)=>A({stack:[],entry:null,wire:null},{type:t,template:e,values:n}).valueOf()}})},q=e(new WeakMap),j=(e,t)=>{const n="function"==typeof t?t():t,r=q.get(e)||q.set(e,{stack:[],entry:null,wire:null}),l=n instanceof S?A(r,n):n;return l!==r.wire&&(r.wire=l,e.textContent="",e.appendChild(l.valueOf())),e},W=T("html"),_=T("svg");var H="function"==typeof Promise?Promise:function(e){let t,n=[],r=0;return e(e=>{t=e,r=1,n.splice(0).forEach(l)}),{then:l};function l(e){return r?setTimeout(e,0,t):n.push(e),this}};const{document:B,MutationObserver:R,Set:z,WeakMap:D}=self,P=e=>"querySelectorAll"in e,{filter:F}=[];const{create:V,keys:G}=Object,I=new WeakMap,J=new Set,K=[],Q={},U={},X=(e,t)=>{for(let n=I.get(t),r=0,{length:l}=e;r<l;r++){const{target:t,attributeName:l,oldValue:o}=e[r],s=t.getAttribute(l);n.attributeChanged(l,o,s)}},{drop:Y,flush:Z,parse:ee}=(e=>{const t=new D,n=t=>{const{query:n}=e;if(n.length)for(let e=0,{length:l}=t;e<l;e++)r(F.call(t[e].addedNodes,P),!0,n),r(F.call(t[e].removedNodes,P),!1,n)},r=(n,o,i,a=new z)=>{for(let c,u,d=0,{length:h}=n;d<h;d++)if(!a.has(u=n[d])){if(a.add(u),o)for(let n,r=l(u),s=0,{length:a}=i;s<a;s++)r.call(u,n=i[s])&&(t.has(u)||t.set(u,new z),c=t.get(u),c.has(n)||(c.add(n),e.handle(u,o,n)));else t.has(u)&&(c=t.get(u),t.delete(u),c.forEach(t=>{e.handle(u,o,t)}));r(s(u),o,i,a)}},l=e=>e.matches||e.webkitMatchesSelector||e.msMatchesSelector,o=(t,n=!0)=>{r(t,n,e.query)},s=e=>c.length?e.querySelectorAll(c):c,i=new R(n),a=e.root||B,{query:c}=e;return i.observe(a,{childList:!0,subtree:!0}),o(s(a)),{drop:e=>{for(let n=0,{length:r}=e;n<r;n++)t.delete(e[n])},flush:()=>{n(i.takeRecords())},observer:i,parse:o}})({query:K,handle(e,t,n){const{m:r,l:l,o:o}=Q[n],s=r.get(e)||((e,t,n,r)=>{const l=V(r,{element:{enumerable:!0,value:e}});for(let t=0,{length:r}=n;t<r;t++)e.addEventListener(n[t].t,l,n[t].o);t.set(e,l),l.init&&l.init();const{observedAttributes:o}=r;if(o){const t=new MutationObserver(X);t.observe(e,{attributes:!0,attributeOldValue:!0,attributeFilter:o.map(t=>(e.hasAttribute(t)&&l.attributeChanged(t,null,e.getAttribute(t)),t))}),I.set(t,l)}return l})(e,r,l,o),i=t?"connected":"disconnected";i in s&&s[i]()}}),te=(e,t)=>{if(-1<K.indexOf(e))throw new Error("duplicated: "+e);Z();const n=[],r=V(null);for(let e=G(t),l=0,{length:o}=e;l<o;l++){const o=e[l];if(/^on/.test(o)&&!/Options$/.test(o)){const e=t[o+"Options"]||!1,l=o.toLowerCase();let s=l.slice(2);n.push({t:s,o:e}),r[s]=o,l!==o&&(s=o.slice(2,3).toLowerCase()+o.slice(3),r[s]=o,n.push({t:s,o:e}))}}n.length&&(t.handleEvent=function(e){this[r[e.type]](e)}),K.push(e),Q[e]={m:new WeakMap,l:n,o:t},ee(document.querySelectorAll(e)),re(e),J.has(e)||U[e]._()},ne=e=>{K.length&&(Z(),ee([e]))},re=e=>{if(!(e in U)){let t,n=new H(e=>{t=e});U[e]={_:t,$:n}}return U[e].$};
let le=__handlers__;
function oe(e){return function(){let t=e.apply(null,arguments);return ne(t),t}}Object.keys(le).forEach(e=>te(`.${e},${e},[is="${e}"]`,le[e])),W.node=oe(W.node),_.node=oe(W.node);let se=String.raw;function ie(e){var t=document.createElement("template");return t.innerHTML=e,t.content}Object.assign(window,{upgrade:ne,render:j,html:W,svg:_,raw:ie,css:se});export{se as css,W as html,ie as raw,j as render,_ as svg};
