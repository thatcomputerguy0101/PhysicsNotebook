import html from "../html.js"
import { ManipulationItem } from "../manipulations/manipulationItem.js"
import { Manipulation } from "../manipulations/manipulation.js"
import { SimpleManipulation } from "../manipulations/simpleManipulation.js"

export class ManipulationMenu extends React.Component {
  static manipulations = [
    new SimpleManipulation("n1 == n2 + MathQuillSelection(n3)", "n1 - n3 == n2", "-"),
    new SimpleManipulation("n1 + MathQuillSelection(n2) == n3", "n1 == n3 - n2", "-"),
    new SimpleManipulation("n1 == n2 - MathQuillSelection(n3)", "n1 + n3 == n2", "+"),
    new SimpleManipulation("n1 - MathQuillSelection(n2) == n3", "n1 == n3 + n2", "+"),
    new SimpleManipulation("n1 == MathQuillSelection(n2) - n3", "n1 + n3 == n2", "+"),
    
    new SimpleManipulation("n1 == MathQuillSelection(n2)", "n1 - n2 == 0", "-"), //needs parentheses when moving blocks
    new SimpleManipulation("MathQuillSelection(n1) == n2", "0 == n2 - n1", "-"),
    new SimpleManipulation("-MathQuillSelection(-n1) == n2", "n1 == n2", "+"),
    new SimpleManipulation("n1 == -MathQuillSelection(-n2) ", "n1 == n2", "+"),

    new SimpleManipulation("n1 == n2 * MathQuillSelection(n3)", "n1 / n3 == n2", "/"),
    new SimpleManipulation("n1 * MathQuillSelection(n2) == n3", "n1 == n3 / n2", "/"),
    new SimpleManipulation("n1 == n2 / MathQuillSelection(n3)", "n1 * n3 == n2", "*"),
    new SimpleManipulation("n1 / MathQuillSelection(n2) == n3", "n1 == n2 * n3", "*"),





  ]

  constructor(...args) {
    super(...args)
  }

  addState(state) {
    if (typeof this.props.onManipulate == "function") {
      this.props.onManipulate(state)
    }
  }

  render() {
    let rhtml = html.bind({ ManipulationItem })

    // Process this.props.selection for valid manipulations
    var validManips = this.constructor.manipulations.filter(manip => manip.test(this.props.selection))

    if (validManips.length == 0) {
      // No manipulations are valid, return an empty fragment
      return rhtml`<React.Fragment/>`
    }

    // Show the manipulations that are valid by creating ManipulationItem component in html return
    return rhtml`
      <div className="manipulations">
        ${validManips.map(manip =>
            rhtml`<ManipulationItem key=${manip.symbol} symbol=${manip.symbol} apply=${() => this.addState(manip.substitute(this.props.selection))}/>`
        )}
      </div>
    `
  }
}
