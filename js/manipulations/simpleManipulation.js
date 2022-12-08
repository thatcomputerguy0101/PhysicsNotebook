import mjs from "../mathjs/index.js"
import { Manipulation } from "./manipulation.js"

export class SimpleManipulation extends Manipulation {
  constructor(pattern, result, symbol) {
      super()
      this.pattern = pattern
      this.result = result
      this.symbol = symbol
  }

  substitute(state){
    var result = mjs.simplify(state, rules)
    return result
  }
}
