export let transformDefinition = (id, def, props) => {
  let tag = typeof def.tag ===  'function' ? def.tag(props) : def.tag
  let attr = typeof def.attributes === 'function' ? def.attributes(props) : { ...def.attributes }
  let attributes = []
  attr.class = `it-${id} ${attr.className || ""}`
  delete attr.className
  Object.keys(attr).forEach(k => {
    attributes.push([k, attr[k]])
  })
  return { ...def, attributes, tag }
}
