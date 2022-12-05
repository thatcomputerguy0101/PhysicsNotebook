import html from "../html.js"

export class complexManipulation extends Manipulation{
  constructor(pattern, symbol) {
      this.pattern = pattern
      this.symbol = symbol
  }

  substitute(state){
    //do something to state
    return state
  }
}
