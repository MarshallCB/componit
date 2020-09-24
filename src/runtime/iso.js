export function transformDefinition(id, def, props){
  let tag = typeof def.tag ===  'function' ? def.tag(props) : def.tag
  let attributes = typeof def.attributes === 'function' ? def.attributes(props) : { ...def.attributes }
  attributes.class = "it-" + id + (attributes.className ? " " + attributes.className : "");
  delete attributes.className
  return { ...def, attributes, tag }
}
