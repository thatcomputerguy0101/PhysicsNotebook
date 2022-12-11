import mjs from "../mathjs/index.js"
import { Manipulation } from "./manipulation.js"

export class SimpleManipulation extends Manipulation {
  constructor(replacements, symbol) {
      super()
      this.replacements = replacements
      this.symbol = symbol
  }

  substitute(state) {
    var result = mjs.simplify(state, mjs.simplify.rules.concat(this.replacements))
    return result
  }
}
