import html from "../html.js"
import { Equation } from "../equationPacks/equation.js"

export class EquationState extends React.Component {
  constructor(...args) {
    super(...args)
    this.handleSelection = this.handleSelection.bind(this)
  }

  render() {
    let rhtml = html.bind({Equation})
    return rhtml`
    <Equation onSelectionChange=${this.handleSelection}>
      ${this.props.value}
    </Equation>`
  }

  handleSelection(selection) {
    // Check what manupulations are valid based on the selection here (maybe with a slight delay)
    // Then allow the user to choose one to apply, which creates a new EquationState
    console.log("New selection:", selection)
  }
}
