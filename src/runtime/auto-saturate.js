import { defineAsync, upgrade } from 'wicked-elements'

import('./componit.js')
  //|     
 //||     
//_||  @  //m4r.sh/

const loaded = new Set;

const nodesToSaturate = __handler_id_array__; // Replaced by Rollup plugin during build process
const idToImport = (id) => `/it/${id}/${id}-handler.js`;
const prefix = 'it-';

// const load = mutations => {
//   for (let i = 0, {length} = mutations; i < length; i++) {
//     for (let {addedNodes} = mutations[i], j = 0, {length} = addedNodes; j < length; j++ ) {
//       const node = addedNodes[j];
//       if (node.querySelectorAll) {
//         const classes = node.classList.value + " " + (node.getAttribute('is') || node.tagName);
//         let id = classes.substr(classes.indexOf(prefix) + prefix.length).split(" ")[0];
//         let it = id.length ? prefix + id : null;
//         if (it && !loaded.has(it) && nodesToSaturate.includes(id)) {
//           loaded.add(it);
//           defineAsync(`.${it},${it},[is="${it}"]`, () => {
//             return import(idToImport(id)).then(mod => {
//               return mod;
//             }).catch((e) => {
//               console.log(e)
//               console.log("No component found for " + id);
//             });
//            });
//         }
//         crawl(node.querySelectorAll('*'));
//       }
//     }
//   }
// };
// const crawl = addedNodes => { load([{addedNodes}]); };
// crawl(document.querySelectorAll('*'));
// const observer = new MutationObserver(load);
// observer.observe(document, {subtree: true, childList: true});
window.upgrade = upgrade;

nodesToSaturate.forEach(id => {
  let it = `${prefix}${id}`
  defineAsync(`.${it},${it},[is="${it}"]`, () => {
    return import(idToImport(id)).then(mod => {
      return mod;
    }).catch((e) => {
      console.log(e)
      console.log("No component found for " + id);
    });
   });
});