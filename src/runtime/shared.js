export function transformDefinition(id, def, props){
  let tag = typeof def.tag ===  'function' ? def.tag(props) : def.tag
  let attr = typeof def.attributes === 'function' ? def.attributes(props) : { ...def.attributes }
  attr.class = "it-" + id + " " + attr.className;
  delete attr.className
  return { ...def, attributes, tag }
}
