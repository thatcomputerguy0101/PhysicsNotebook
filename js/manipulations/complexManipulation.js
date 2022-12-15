import html from "../display/html.js"

export class ComplexManipulation extends Manipulation{
  constructor(pattern, symbol) {
    this.replacements = {l: pattern, r: "ManipulationResult"}
    this.symbol = symbol
  }

  substitute(state) {
    //do something to state
    return state
  }
}
