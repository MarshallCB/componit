// Transform definition by resolving tag & attributes if they rely on props
export function transformDefinition(id, def, props){
  // Resolve tag & attributes if they depend on props
  let tag = typeof def.tag ===  'function' ? def.tag(props) : def.tag
  let attributes = typeof def.attributes === 'function' ? def.attributes(props) : { ...def.attributes }
  // Transform className -> class and add componit identifier: it-[id]
  attributes.class = "it-" + id + (attributes.className ? " " + attributes.className : "");
  delete attributes.className
  return { ...def, attributes, tag }
}
