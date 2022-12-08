import html from "../html.js"
import mjs from "../mathjs/index.js"
import { Equation } from "../equationPacks/equation.js"
import { ManipulationMenu } from "../display/manipulationMenu.js"

export class EquationState extends React.Component {
  static defaultProps = {
    value: new mjs.ConstantNode()
  }

  constructor(...args) {
    super(...args)
    this.handleSelection = this.handleSelection.bind(this)
    this.state = {
      selection: null
    }
  }

  onManipulate(state) {
    if (typeof this.props.onManipulate == "function") {
      this.props.onManipulate(state)
    }
  }

  render() {
    let rhtml = html.bind({ Equation })
    return rhtml`
    <Equation className="state" onSelectionChange=${this.handleSelection}>
      ${this.props.value.toTex().replace(/([^\\])~/g, "$1").replace("$~", "")}
    </Equation>
    ${
      selection != null
        ? rhtml`<ManipulationMenu selection=${this.state.selection}/>`
        : rhtml`<React.Fragment/>`
    }
    `
  }

  handleSelection(selection) {
    console.log("New selection:", selection)
    this.setState({selection})
  }
}
