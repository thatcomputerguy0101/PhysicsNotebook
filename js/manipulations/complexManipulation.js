import html from "../html.js"

export class complexManipulation extends Manipulation{
  constructor(pattern, symbol) {
      this.replacements = {l: pattern, r: "ManipulationResult"}
      this.symbol = symbol
  }

  substitute(state) {
    //do something to state
    return state
  }
}
