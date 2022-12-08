import html from "../html.js"
import { EquationState } from "../workbooks/equationState.js"
import { ManipulationItem } from "../manipulations/manipulationItem.js"
import { Manipulation } from "../manipulations/manipulation.js"
import { SimpleManipulation } from "../manipulations/simpleManipulation.js"

export class ManipulationMenu extends React.Component {
  static manipulations = [
    new SimpleManipulation("n1 == n2 + MathQuillSelection(3)", "n1 - n3 == n2", "-")
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
    let rhtml = html.bind({EquationState})


    // Process this.props.selection for valid manipulations
    var validManips = this.constructor.manipulations.filter(manip => manip.test(this.props.selection))

    // Show the manipulations that are valid by creating ManipulationItem component in html return


    if (validManips.length == 0) {
      // No manipulations are valid, return an empty fragment
      return rhtml`<React.Frament/>`
    }

    return rhtml`
      <div class="manipulations">
        ${validManips.map(manip =>
            rhtml`<ManipulationItem symbol=${manip.symbol} apply=${() => this.addState(manip.subsitute(this.props.selection))}/>`
        )}
      </div>
    `
  }
}
