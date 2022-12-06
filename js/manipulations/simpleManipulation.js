import mjs from "../mathjs/index.js"


export class SimpleManipulation extends Manipulation {
  constructor(pattern, symbol) {
      this.pattern = pattern
      this.symbol = symbol
  }

  substitute(state){
    var result = mjs.simplify(state, rules)
    return result
  }
}
