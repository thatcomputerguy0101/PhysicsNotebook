// // @ts-check
// import React from "react"

/**
  * Parses HTML fragments with possible insertions to React syntax. Insertions can be either text or an externally parsed node
  * This acts as a raw string annotation, demonstrated as follows: html`<tag><subtag/></tag>`
  *
  * When zero or multiple root-level elements are provided, this combines them together as a React.Fragment
  * @param {TemplateStringsArray} source
  * @param {...React.ReactNode} subsitutions
  * @returns {React.ReactNode}
  */
export default function html(source, ...subsitutions) {
  /**
   * @type {{string: React.ComponentType}}
   */
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
    result = React.createElement(React.Fragment, null, ...result)
  }
  return result
}

/**
 * Error thrown whenever something unexpected occurs during HTML parsing
 */
class ParsingError extends SyntaxError {
  /**
   * Creates a new ParsingError
   * @param {string} message Message describing what when wrong during parsing
   */
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

  /**
   * Converts HTML ampresand entities to their corresponding characters
   * @param {string} str Raw HTML string
   * @returns {string} Parsed string
   */
  return function decodeEntities(str) {
    // Remove script/html tags
    str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '')
    str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '')
    // Put sanatized input in an HTML element as source code
    element.innerHTML = str
    // Read it back out as text
    // @ts-ignore
    str = element.textContent
    // Reset the element
    element.textContent = ''
    return str
  }
})()

/**
 * Parses a sequence of HTML tags, comments, and body text
 * @param {HTMLTokenizer} tokenizer HTML token generator
 * @returns {React.ReactNode}
 * @throws {ParsingError}
 */
function fragment(tokenizer) {
  if (tokenizer.isEmpty()) {
    return []
  }
  let token = tokenizer.nextToken()
  let first
  if (token.type == Token.Type.comment_start) {
    comment(tokenizer)
    token = tokenizer.nextToken()
  }
  if (token.type == Token.Type.tag_start && !token.closing) {
    // Tag
    first = tag(tokenizer)
  } else if (token.type == Token.Type.tag_start && token.closing) {
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
  if (token.type == Token.Type.comment_start) {
    comment(tokenizer)
    token = tokenizer.nextToken()
  }
  if (token.type == Token.Type.tag_start && token.closing) {
    // Single element (Tag or Text)
    return first
  } else {
    let contents = [first]
    while (token.type != Token.Type.tag_start || !token.closing) {
      if (token.type == Token.Type.comment_start) {
        comment(tokenizer)
        token = tokenizer.nextToken()
      }
      if (token.type == Token.Type.tag_start && !token.closing) {
        // Tag
        contents.push(tag(tokenizer))
      } else {
        // Text (or external Tag)
        if (typeof contents[contents.length - 1] == "string" && typeof token.data == "string") {
          // Concatenate consecutive string
          contents[contents.length - 1] += token.data
        } else {
          contents.push(token.data)
        }
        token.consume()
      }
      if (tokenizer.isEmpty()) {
        break
      }
      token = tokenizer.nextToken()
    }
    if (contents.length == 1) {
      return contents[0]
    } else {
      return contents
    }
  }
}

/**
 * Parses a HTML tag
 * @param {HTMLTokenizer} tokenizer HTML token generator
 * @returns {React.ReactElement}
 * @throws {ParsingError}
 */
function tag(tokenizer) {
  let start = tokenizer.nextToken()
  if (start.type != Token.Type.tag_start) {
    throw new ParsingError(`Invalid character, expected to find "<"`)
  }
  start.consume()
  let name = tokenizer.nextToken()
  if (name.type != Token.Type.tag_name) {
    throw new ParsingError(`Invalid character, expected to find the name of a tag`)
  }
  name.consume()
  let attrOrEnd = tokenizer.nextToken()
  let attributes = {}
  while (attrOrEnd.type == Token.Type.attribute_name) {
    let attribute = attrOrEnd
    attrOrEnd.consume()
    attrOrEnd = tokenizer.nextToken()
    let value
    if (attrOrEnd.type == Token.Type.attribute_assign) {
      attrOrEnd.consume()
      value = tokenizer.nextToken()
      if (value.type != Token.Type.attribute_value) {
        throw new ParsingError(`Expected an attribute value, got ${Token.Type.key(value.type)} instead`)
      }
      value = value.consume().data
      attrOrEnd = tokenizer.nextToken()
    } else {
      value = true
    }
    attributes[attribute.name] = value
  }
  if (attrOrEnd.type != Token.Type.tag_end) {
      throw new ParsingError(`Invalid character, expected to find ">"`)
  }
  let end = attrOrEnd.consume()
  if (end.closing || name.name in void_elements) {
    return React.createElement(name.name, attributes)
  } else {
    let contents = fragment(tokenizer)
    let closeStart = tokenizer.nextToken()
    if (closeStart.type != Token.Type.tag_start || !closeStart.closing) {
      throw new ParsingError(`Invalid character, expected to find "</"`)
    }
    closeStart.consume()
    let closeName = tokenizer.nextToken()
    if (closeName.type != Token.Type.tag_name) {
      throw new ParsingError(`Invalid character, expected to find the name of a tag`)
    } else if (closeName.name != name.name) {
      throw new ParsingError(`Mismatched tags, found ${closeName.name}, expected ${name.name}`)
    }
    closeName.consume()
    let closeEnd = tokenizer.nextToken()
    if (closeEnd.type != Token.Type.tag_end || closeEnd.closing) {
      throw new ParsingError(`Invalid character, expected to find ">"`)
    }
    closeEnd.consume()
    if (Array.isArray(contents)) {
      return React.createElement(name.name, attributes, ...contents)
    } else {
      return React.createElement(name.name, attributes, contents)
    }
  }
}

/**
 * Parses a HTML comment
 * @param {HTMLTokenizer} tokenizer HTML token generator
 * @throws {ParsingError}
 */
function comment(tokenizer) {
  // This currently just verifies correct comment syntax and discards the results
  let start = tokenizer.nextToken()
  if (start.type != Token.Type.comment_start) {
    throw new ParsingError(`Invalid character, expected to find "<!--"`)
  }
  start.consume()

  let bodyOrEnd = tokenizer.nextToken()
  while (bodyOrEnd.type != Token.Type.comment_end) {
    if (bodyOrEnd.type != Token.Type.comment_body) {
      throw new ParsingError(`Invalid token, expected a comment body or "-->"`)
    }
    bodyOrEnd.consume()
    bodyOrEnd = tokenizer.nextToken()
  }
  bodyOrEnd.consume()
}

/**
 * Parses HTML tokens from template string information
 */
export class HTMLTokenizer {
  /**
   * Creates a new tokenizer
   * @param {string[]} source
   * @param {React.ReactNode[]} subsitutions
   * @param {{string: React.ComponentType}} bindings
   */
  constructor(source, subsitutions, bindings) {
    this.source = source
    this.subsitutions = subsitutions
    this.bindings = bindings
    // Initial state machine state
    /**
     * @type {Token}
     */
    this.activeToken = new Token(Token.Type.text, undefined)
    this.activeToken.consume()
  }

  /**
   * Checks if there is an available token to parse
   * @returns {boolean}
   */
  isEmpty() {
    return this.source.length == 0 || this.source.length == 1 && this.source[0].length == 0
  }

  /**
   * Gets the next non-consumed HTML token, parsing if required
   * @returns {Token} Class representing the token type and associated literal
   * @throws {ParsingError}
   */
  nextToken() {
    if (!this.activeToken.consumed) {
      return this.activeToken
    }

    if (this.isEmpty()) {
      throw new ParsingError("Reached end of input")
    }

    this.stripWhitespace()

    if ([Token.Type.tag_end, Token.Type.comment_end, Token.Type.text].includes(this.activeToken.type)) {
      // Not in a tag, can start a new tag or can parse text
      let match
      if (this.source[0].match(/^<!--/)) {
        this.activeToken = new Token(Token.Type.comment_start)
        this.source[0] = this.source[0].slice(4)
      } else if (this.source[0].match(/^</) != null) {
        // Tag start
        this.activeToken = new Token(Token.Type.tag_start, this.source[0].match(/^<\//) != null)
        this.source[0] = this.source[0].slice(this.activeToken.closing ? 2 : 1)
      } else if (this.source[0].length == 0) {
        // Text (or external tag) from subsitution
        this.source.splice(0, 1) // Remove empty string from source
        this.activeToken = new Token(Token.Type.text, this.subsitutions.splice(0, 1)[0])
      } else if ((match = this.source[0].match(/[^<>]+/)) != null) {
        // Text from source
        let data = match[0]
        this.activeToken = new Token(Token.Type.text, decodeEntities(data))
        this.source[0] = this.source[0].slice(this.activeToken.data.length)
      }
    } else if ([Token.Type.comment_start, Token.Type.comment_body].includes(this.activeToken.type)) {
      if (this.source[0].match(/^-->/)) {
        this.activeToken = new Token(Token.Type.comment_end)
        this.source[0] = this.source[0].slice(3)
      } else {
        this.activeToken = new Token(Token.Type.comment_body, this.matchComment())
      }
    } else if (this.activeToken.type == Token.Type.tag_start) {
      // At the start of a tag
      if (this.source[0].match(/^\/?>/) != null) {
        // If an empty tag, return a fragment
        this.activeToken = new Token(Token.Type.tag_name, React.Fragment)
      } else {
        // Parse the name of the tag
        this.activeToken = new Token(Token.Type.tag_name, this.matchName())
      }
    } else if ([Token.Type.tag_name, Token.Type.attribute_name, Token.Type.attribute_value].includes(this.activeToken.type)) {
      // Within a tag, can parse attributes or tag end
      if (this.source[0].match(/^\/?>/)) {
        // End of opening tag or self-closing tag
        this.activeToken = new Token(Token.Type.tag_end, this.source[0][0] == "/")
        this.source[0] = this.source[0].slice(this.activeToken.closing ? 2 : 1)
      } else if (this.activeToken.type == Token.Type.attribute_name && this.source[0].match(/^=/)) {
        // Attribute assignment, followed by attribute value
        this.activeToken = new Token(Token.Type.attribute_assign)
        this.source[0] = this.source[0].slice(1)
      } else {
        // Attribute
        this.activeToken = new Token(Token.Type.attribute_name, this.matchName())
      }
    } else if (this.activeToken.type == Token.Type.attribute_assign) {
      // Attribute value
      this.activeToken = new Token(Token.Type.attribute_value, this.matchString())
    }

    if (this.activeToken.consumed) {
      throw new ParsingError("Unable to match any tokens")
    }

    return this.activeToken
  }

  /**
   * Removes extra whitespace from the start of the source string
   */
  stripWhitespace() {
    this.source[0] = this.source[0].trimStart()
  }

  /**
   * HTML tag or attribute name
   * @returns {(string|boolean|number)} Matched body token
   * @throws {ParsingError}
   */
  matchName() {
    // HTML tag or attribute name
    let tag_name = this.matchOrSubsitute(() => {
      // Pull from source
      let match = this.source[0].match(/^[A-Za-z][A-Za-z0-9\-_:.]*/)
      if (match == null) {
        if (this.activeToken.type == Token.Type.tag_start) {
          throw new ParsingError(`Expected a tag name following ${this.activeToken.closing ? "</" : "<"}`)
        } else {
          throw new ParsingError("Expected an attribute name")
        }
      }
      let tag_name = match[0]
      this.source[0] = this.source[0].slice(tag_name.length)
      return tag_name
    })
    if (tag_name in this.bindings) {
      // Bindings represent subsitutions of names to special element types
      tag_name = this.bindings[tag_name]
    }
    return tag_name
  }

  /**
   * HTML attribute value, quoted or unquoted.
   * Unquoted values may be parsed as booleans or numbers.
   * @returns {(string|boolean|number)} Matched body token
   * @throws {ParsingError}
   */
  matchString() {
    return this.matchOrSubsitute(() => {
      // Pull from source
      let match
      let attribute_value
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
      if (typeof attribute_value == "string") {
        return decodeEntities(attribute_value)
      } else {
        return attribute_value
      }
    })
  }

  /**
   * Comment body text
   * @returns {string} Matched body text
   * @throws {ParsingError}
   */
  matchComment() {
    return this.matchOrSubsitute(() => {
      let match = this.source[0].match(/^(?:[^-]|-[^-]|--[^>])+/)
      if (match == null) {
        throw new ParsingError("Encountered unexpected comment end")
      }
      let text = match[0]
      this.source[0] = this.source[0].slice(text.length)
      return text
    })
  }

  /**
   * For parsing tokens that support subsitution.
   * Pulls from source with matcher if available, pulls directly from a subsitution otherwise.
   * @template {React.ReactNode} Match
   * @param {() => Match} matcher - A parameterless function to parse a valid token from source
   * @returns {Match} Matched token literal (usually a string)
   */
   matchOrSubsitute(matcher) {
    if (this.source[0].length > 0) {
      return matcher()
    } else {
      // Insert subsitution
      this.source.splice(0, 1) // Remove empty string from source
      // @ts-ignore
      return this.subsitutions.splice(0, 1)[0]
    }
  }
}

/**
 * Class representing a single HTML token, including type and data
 * @template {React.ReactNode | React.ComponentType} Data
 */
class Token {
  /**
   * Enumeration representing a HTML token type
   * @readonly
   * @enum {number}
   */
  static Type = class Type {
    /** Literal text, not part of a tag */
    static text = 0
    /** The opening symbols of a tag (either opening or closing tag) */
    static tag_start = 1
    /** The name of a tag */
    static tag_name = 2
    /** The closing symbols of a tag (either regular or self-closing tag) */
    static tag_end = 3
    /** The name of a tag attribute */
    static attribute_name = 4
    /** The assignment symbol of an attribute with a value */
    static attribute_assign = 5
    /** The value of an attribute */
    static attribute_value = 6
    /** The opening symbols of a comment tag */
    static comment_start = 7
    /** The content of a comment tag */
    static comment_body = 8
    /** The closing symbols of a comment tag */
    static comment_end = 9

    /**
     * Converts from the integer representation of a HTML token type back to its name
     * @param {Type} self Integer representing the token type
     * @returns {string} Name of the token type
     */
    static key(self) {
      switch (self) {
        case 0:
          return "text"
        case 1:
          return "tag_start"
        case 2:
          return "tag_name"
        case 3:
          return "tag_end"
        case 4:
          return "attribute_name"
        case 5:
          return "attribute_assign"
        case 6:
          return "attribute_value"
        case 7:
          return "comment_start"
        case 8:
          return "comment_body"
        case 9:
          return "comment_end"
        default:
          return "unknown"
      }
    }
  }

  /**
   * Creates a new HTML token
   * @param {Type} type Integer representing the token type
   * @param {Data} [data] Additional data, such as name or presence of a closing slash
   */
  constructor(type, data) {
    /** @type {Type} */
    this.type = type
    /** @type {Data | undefined} */
    this.data = data
    /** @type {boolean} */
    this.consumed = false
  }

  /**
   * Name of a tag or attribute
   * @type {string}
   */
  get name() {
    // @ts-ignore
    return this.data
  }

  /**
   * True if this token includes a closing slash
   * @type {boolean}
   */
  get closing() {
    // @ts-ignore
    return this.data
  }

  /**
   * Marks a token as consumed and that the parser is ready for the next token
   * @returns {Token} This object for shorthand chaining
   */
  consume() {
    this.consumed = true
    return this
  }
}

// Lock Token.Type enum values to be constant
Object.defineProperties(
  Token.Type,
  Object.fromEntries(
    Object.entries(Object.getOwnPropertyDescriptors(Token.Type))
      .map(([key, descriptor]) => [key, {...descriptor, writable: false}])
  )
)
