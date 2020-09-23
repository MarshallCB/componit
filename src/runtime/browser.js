import { render, html, svg } from 'uhtml';
import { transformDefinition } from './shared'

export default (id, definition) => (props) => {
  let { attributes, tag, inner } = transformDefinition(id, definition, props)

  let el = document.createElement(tag);
  el.props = props;
  Object.keys(attributes).forEach(k => {
    // todo: some of these should be properties of the el, like .value and such
    el.setAttribute(k, attributes[k])
  })
  render(el, inner.call({ html, svg }, props));
  return el;
}

// window.it = augm.it({ folder, queries })
// it is now a global variable for our components --> it.exampleButton(props) --> returns HTMLNode or dummy element that it will replace when it loads asynchronously
// this is guud for augm.to flows
/**
 * 
 * function* flow(){
 *  yield it['example'](props);
 *  yield* to['study'];
 * }
 * 
 * 
 * 
 * 
 * 
 */

// on page load, find all matches to queries, then import from folder
// if from augm.it CDN, it can return multi-queries (.it/?c=example1.saturation,example2.all,example-three.render) for extra perf boost
// ^ great for augm.at
// space.augm.it/[component]?value=3,id="3fsd",etc -- could be an iframe
// augm.at could literally be so easy! OMG!
