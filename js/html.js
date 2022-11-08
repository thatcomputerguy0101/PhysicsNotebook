
let Fragment = React.Fragment

/**
  * Parses HTML fragments with possible insertions to React syntax. Insertions can be either text or an externally parsed node
  * This acts as a raw string annotation, demonstrated as follows: html`<tag><subtag/></tag>`
  *
  * When zero or multiple root-level elements are provided, this combines them together as a React.Fragment
  */
export default function html(source, ...subsitutions) {
  let bindings = {}
  if (typeof this == "object") {
    bindings = this
  }
  bindings["React.Fragment"] = React.Fragment
  let tokenizer = new HTMLTokenizer(Array.from(source.raw), subsitutions, bindings)
  let result = fragment(tokenizer)
  if (!tokenizer.isEmpty()) {
    throw new ParsingError("Unexpected input at end")
  }
  if (Array.isArray(result)) {
    result = React.createElement(Fragment, null, ...result)
  }
  return result
}

class ParsingError extends SyntaxError {
  constructor(message) {
    super(message)
    this.name = "ParsingError"
  }
}

const void_elements = [
  "area", "base", "br", "col", "command", "embed", "hr", "image", "input",
  "keygen", "link", "meta", "param", "source", "track", "wbr"
]

let decodeEntities = (function() {
  // Cache this element so that it is only created once
  const element = document.createElement('div');

  return function decodeEntities (str) {
    if (str && typeof str === 'string') {
      // Remove script/html tags
      str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '')
      str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '')
      // Put sanatized input in an HTML element as source code
      element.innerHTML = str
      // Read it back out as text
      str = element.textContent
      // Reset the element
      element.textContent = ''
    }

    return str
  }
})()

function fragment(tokenizer) {
  if (tokenizer.isEmpty()) {
    return []
  }
  let token = tokenizer.nextToken()
  let first
  if (token.type == "tag_start" && !token.closing) {
    // Tag
    first = tag(tokenizer)
  } else if (token.type == "tag_start" && token.closing) {
    // Empty
    return []
  } else {
    // Text (or external Tag)
    first = token.data
    token.consume()
  }
  if (tokenizer.isEmpty()) {
    return first
  }
  token = tokenizer.nextToken()
  if (token.type == "tag_start" && token.closing) {
    // Single element (Tag or Text)
    return first
  } else {
    let contents = [first]
    while (token.type != "tag_start" || !token.closing) {
      if (token.type == "tag_start" && !token.closing) {
        // Tag
        contents.push(tag(tokenizer))
      } else {
        // Text (or external Tag)
        contents.push(token.data)
        token.consume()
      }
      if (tokenizer.isEmpty()) {
        break
      }
      token = tokenizer.nextToken()
    }
    return contents
  }
}

function tag(tokenizer) {
  let start = tokenizer.nextToken()
  if (start.type != "tag_start") {
    throw new ParsingError(`Invalid character, expected to find "<"`)
  }
  start.consume()
  let name = tokenizer.nextToken()
  if (name.type != "tag_name") {
    throw new ParsingError(`Invalid character, expected to find the name of a tag`)
  }
  name.consume()
  let attr_or_end = tokenizer.nextToken()
  let attributes = {}
  while (attr_or_end.type == "attribute_name") {
    let attribute = attr_or_end
    attr_or_end.consume()
    attr_or_end = tokenizer.nextToken()
    let value = true
    if (attr_or_end.type == "attribute_assign") {
      attr_or_end.consume()
      value = tokenizer.nextToken()
      if (value.type != "attribute_value") {
        throw new ParsingError(`Expected an attribute value, got ${value.type} instead`)
      }
      value = value.consume().data
      attr_or_end = tokenizer.nextToken()
    }
    attributes[attribute.name] = value
  }
  if (attr_or_end.type != "tag_end") {
      throw new ParsingError(`Invalid character, expected to find ">"`)
  }
  let end = attr_or_end.consume()
  if (end.closing || name.name in void_elements) {
    return React.createElement(name.name, attributes)
  } else {
    let contents = fragment(tokenizer)
    let close_start = tokenizer.nextToken()
    if (close_start.type != "tag_start" || !close_start.closing) {
      throw new ParsingError(`Invalid character, expected to find "</"`)
    }
    close_start.consume()
    let close_name = tokenizer.nextToken()
    if (close_name.type != "tag_name") {
      throw new ParsingError(`Invalid character, expected to find the name of a tag`)
    } else if (close_name.name != name.name) {
      throw new ParsingError(`Mismatched tags, found ${close_name.name}, expected ${name.name}`)
    }
    close_name.consume()
    let close_end = tokenizer.nextToken()
    if (close_end.type != "tag_end" || close_end.closing) {
      throw new ParsingError(`Invalid character, expected to find ">"`)
    }
    close_end.consume()
    if (Array.isArray(contents)) {
      return React.createElement(name.name, attributes, ...contents)
    } else {
      return React.createElement(name.name, attributes, contents)
    }
  }
}

export class HTMLTokenizer {
  constructor(source, subsitutions, bindings) {
    this.source = source
    this.subsitutions = subsitutions
    this.bindings = bindings
    // Initial state machine state
    this.active_token = new Token("text", null)
    this.active_token.consume()
  }

  isEmpty() {
    return this.source.length == 0 || this.source.length == 1 && this.source[0].length == 0
  }

  nextToken() {
    if (!this.active_token.consumed) {
      return this.active_token
    }

    if (this.isEmpty()) {
      throw new ParsingError("Reached end of input")
    }

    this.stripWhitespace()

    if (["tag_end", "text"].includes(this.active_token.type)) {
      // Not in a tag, can start a new tag or can parse text
      if (this.source[0].match(/^</) != null) {
        // Tag start
        this.active_token = new Token("tag_start", this.source[0].match(/^<\//) != null)
        this.source[0] = this.source[0].slice(this.active_token.closing ? 2 : 1)
      } else if (this.source[0].length == 0) {
        // Text (or external tag) from subsitution
        this.source.splice(0, 1) // Remove empty string from source
        this.active_token = new Token("text", this.subsitutions.splice(0, 1)[0])
      } else if (this.source[0].match(/[^<>]+/) != null) {
        // Text from source
        let data = RegExp.lastMatch
        this.active_token = new Token("text", decodeEntities(data))
        this.source[0] = this.source[0].slice(this.active_token.data.length)
      }
    } else if (this.active_token.type == "tag_start") {
      // At the start of a tag
      if (this.source[0].match(/^\/?>/) != null) {
        // If an empty tag, return a fragment
        this.active_token = new Token("tag_name", Fragment)
      } else {
        // Parse the name of the tag
        this.active_token = new Token("tag_name", this.matchName())
      }
    } else if (["tag_name", "attribute_name", "attribute_value"].includes(this.active_token.type)) {
      // Within a tag, can parse attributes or tag end
      if (this.source[0].match(/^\/?>/)) {
        // End of opening tag or self-closing tag
        this.active_token = new Token("tag_end", this.source[0][0] == "/")
        this.source[0] = this.source[0].slice(this.active_token.closing ? 2 : 1)
      } else if (this.active_token.type == "attribute_name" && this.source[0].match(/^=/)) {
        // Attribute assignment, followed by attribute value
        this.active_token = new Token("attribute_assign")
        this.source[0] = this.source[0].slice(1)
      } else {
        // Attribute
        this.active_token = new Token("attribute_name", this.matchName())
      }
    } else if (this.active_token.type == "attribute_assign") {
      // Attribute value
      this.active_token = new Token("attribute_value", this.matchString())
    }

    if (this.active_token.consumed) {
      throw new ParsingError("Unable to match any tokens")
    }

    return this.active_token
  }

  stripWhitespace() {
    // Remove extra whitespace from the start of the source string
    this.source[0] = this.source[0].trimStart()
  }

  matchName() {
    // HTML tag or attribute name
    let tag_name
    if (this.source[0].length > 1) {
      // Pull from source
      let match = this.source[0].match(/^[A-Za-z][A-Za-z0-9\-_:.]+/)
      if (match == null) {
        if (this.active_token.type == "tag_open") {
          throw new ParsingError(`Expected a tag name following ${this.active_token.closing ? "</" : "<"}`)
        } else {
          throw new ParsingError("Expected an attribute name")
        }
      }
      tag_name = match[0]
      this.source[0] = this.source[0].slice(tag_name.length)
    } else {
      // Insert subsitution
      this.source.splice(0, 1) // Remove empty string from source
      tag_name = this.subsitutions.splice(0, 1)[0]
    }
    if (tag_name in this.bindings) {
      // Bindings represent subsitutions of names to special element types
      tag_name = this.bindings[tag_name]
    }
    return tag_name
  }

  matchString() {
    // HTML attribute value, quoted or unquoted
    let attribute_value
    if (this.source[0].length > 1) {
      // Pull from source
      let match
      if ((match = this.source[0].match(/^(?:"([^"<]*)"|'([^'<]*)')/)) != null) {
        attribute_value = match[1] ?? match[2]
      } else if ((match = this.source[0].match(/^[A-Za-z0-9\-_]+/)) != null) {
        // Attempt to parse boolean or number
        if (match[0] == "true") {
          attribute_value = true
        } else if (match[0] == "false") {
          attribute_value = false
        } else if (match[0].match(/^(?:[0-9]+|[0-9]*\.[0-9]+)$/) != null) {
          attribute_value = Number(match[0])
        } else {
          attribute_value = match[0]
        }
      } else {
        throw new ParsingError("Expected an attribute value")
      }
      this.source[0] = this.source[0].slice(match[0].length)
      attribute_value = decodeEntities(attribute_value)
    } else {
      // Insert subsitution
      this.source.splice(0, 1) // Remove empty string from source
      attribute_value = this.subsitutions.splice(0, 1)[0]
    }
    return attribute_value
  }
}


class Token {
  constructor(type, data, text) {
    this.type = type
    this.data = data
    this.consumed = false
  }

  get name() {
    return this.data
  }

  get closing() {
    return this.data
  }

  consume() {
    this.consumed = true
    return this
  }
}
