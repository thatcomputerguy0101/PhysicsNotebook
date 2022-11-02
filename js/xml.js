var xmlParser = new DOMParser()

/**
  * Parses XML fragments with possible insertions. Insertions can be either source code or an externally parsed node
  * This acts as a raw string annotation, demonstrated as follows: xml`<tag><subtag/></tag>`
  *
  * The default mode is html
  * To swich modes, bind the tag to another string, as follows: svg = xml.bind("svg")
  * Three modes are currently supported: html, xml, and svg
  *
  * Since html is the default mode, it is reccomended to import this under the name html
  */
export default function xml(source, ...subsitutions) {
  const type = this || "html"
  // Parses XML source code with possible insertions. Insertions can be either source code or an externally parsed node
  var keepSource = true, code
  if (typeof source == "string") {
    source = [source]
  } else {
    source = source.slice()
  }
  for (var i in subsitutions) {
    if (
         subsitutions[i] instanceof Node
      || subsitutions[i] instanceof HTMLCollection
      || subsitutions[i] instanceof NodeList || (
        Array.isArray(subsitutions[i]) && (
             subsitutions[i][0] instanceof Node
          || subsitutions[i][0] instanceof HTMLCollection
          || subsitutions[i][0] instanceof NodeList
        )
      )
    ) {
      keepSource = false
      source.splice(i * 2 + 1, 0, `<unknown class="xml_placeholder_${i}__"></unknown>`)
    } else {
      source.splice(i * 2 + 1, 0, subsitutions[i])
    }
  }
  source = source.join("")

  switch (type) {
    case "xml":
      code = xmlParser.parseFromString(`<wrapper>${source}</wrapper>`, "text/xml").children[0]
      break
    case "html":
      code = xmlParser.parseFromString(source, "text/html").body
      break
    case "svg":
      code = xmlParser.parseFromString(`<group xmlns="http://www.w3.org/2000/svg">${source}</group>`, "image/svg+xml").children[0]
      break
    default:
      throw ValueError(`Unsupported xml document type: ${type}`)
  }

  for (i in subsitutions) {
    if (subsitutions[i] instanceof Node) {
      code.getElementsByClassName(`xml_placeholder_${i}__`)[0].replaceWith(subsitutions[i])
    } else if (
      (Array.isArray(subsitutions[i]) && subsitutions[i][0] instanceof Node)
      || subsitutions[i] instanceof HTMLCollection || subsitutions[i] instanceof NodeList
    ) {
      code.getElementsByClassName(`xml_placeholder_${i}__`)[0].replaceWith(...subsitutions[i])
    } else if (
      Array.isArray(subsitutions[i])
      && (subsitutions[i][0] instanceof HTMLCollection || subsitutions[i][0] instanceof NodeList)
    ) {
      HTMLCollection.prototype[Symbol.isConcatSpreadable] = true
      NodeList.prototype[Symbol.isConcatSpreadable] = true
      code.getElementsByClassName(`xml_placeholder_${i}__`)[0]
        .replaceWith(...[].concat(...subsitutions[i]))
      delete HTMLCollection.prototype[Symbol.isConcatSpreadable]
      delete NodeList.prototype[Symbol.isConcatSpreadable]
    }
  }
  if (code.children.length == 1) {
    code = code.children[0]
  } else {
    code = code.childNodes
  }
  if (keepSource) {
    code.source = source
  }
  return code
}
