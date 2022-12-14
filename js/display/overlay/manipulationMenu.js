import html from "../html.js"
import { ManipulationItem } from "./manipulationItem.js"
import algebra from "../../manipulations/algebra.js"

export class ManipulationMenu extends React.Component {
  static manipulations = algebra

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
