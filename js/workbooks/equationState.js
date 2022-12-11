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
    this.onManipulate = this.onManipulate.bind(this)
    this.state = {
      selection: null
    }
  }

  onManipulate(state) {
    if (typeof this.props.onManipulate == "function") {
      this.props.onManipulate(state)
      this.setState({
        selection: null
      })
    }
  }

  render() {
    let rhtml = html.bind({ Equation, ManipulationMenu })
    return rhtml`
      <div className="state">
        ${
          this.state.selection != null
            ? rhtml`<ManipulationMenu selection=${this.state.selection} onManipulate=${this.onManipulate}/>`
            : rhtml`<React.Fragment/>`
        }
        <Equation onSelectionChange=${this.handleSelection}>
          ${mjs.fixTex(this.props.value.toTex())}
        </Equation>
      </div>
    `
  }

  handleSelection(selection) {
    console.log("New selection:", selection)
    if (selection == null) {
      this.setState({selection: null})
    } else {
      // Check for split infix operators
      if (
        /(?:[^([|{]|^)\\MathQuillSelectionStart(?:\+|-|\*|\/|\^|_)/.test(selection.rawFlags) // NOTE: Use lookbehinds once supported in Safari
        || /(?:\+|-|\*|\/|\^|_)\\MathQuillSelectionEnd(?!\\right|\})/.test(selection.rawFlags)
      ) {
        console.log("Skipped selection due to bad infix operator")
        return // TODO: Expand selection to confuse user less
      }
      try {
        this.setState({selection: texmp.parseTex(selection.rawFunction)})
      } catch (error) {
        console.warn(error)
        // Invalid selection border
        // TODO: Extend selection to valid border
      }
    }
  }
}
