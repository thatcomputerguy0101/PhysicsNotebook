import mjs from "../mathjs/index.js"

export class Manipulation {
  pattern = ""
  symbol

  constructor() {
    if (this.constructor == Manipulation) {
      throw new Error("Abstract classes can't be instantiated.")
    } else if (this.substitute == Manipulation.prototype.substitute) {
      throw new Error("Abstract methods must be overridden")
    }
  }

  substitute(selection) {
    throw new Error("Abstract methods can't be called.")
  }

  test(selection) {
    const modSel = mjs.simplify(selection, [{l: this.pattern, r: "MathQuillSelectionResult"}])
    return !selection.equal(modSel)
  }
}
