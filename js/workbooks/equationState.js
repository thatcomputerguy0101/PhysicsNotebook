import html from "../html.js"
import mjs from "../mathjs/index.js"
import { Equation } from "../equationPacks/equation.js"

export class EquationState extends React.Component {
  static defaultProps = {
    value: new mjs.ConstantNode()
  }

  constructor(...args) {
    super(...args)
    this.handleSelection = this.handleSelection.bind(this)
  }

  render() {
    let rhtml = html.bind({Equation})
    return rhtml`
    <Equation className="state" onSelectionChange=${this.handleSelection}>
      ${this.props.value.toTex().replace(/([^\\])~/g, "$1").replace("$~", "")}
    </Equation>`
  }

  handleSelection(selection) {
    console.log("New selection:", selection)
    if (selection != null) {
      console.log("Selection tree:", texmp.parseTex(selection.rawFunction))
      // Check what manupulations are valid based on the selection here (maybe with a slight delay)
      // Then allow the user to choose one to apply, which creates a new EquationState
    } else {
      // No selection, hide manipulation menu
    }
  }
}
