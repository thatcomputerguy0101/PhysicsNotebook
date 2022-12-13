import html from "../html.js"
import mjs from "../mathjs/index.js"
import { Equation } from "../equationPacks/equation.js"

export class Constant extends React.Component {
  static defaultProps = {
    name: new mjs.SymbolNode(""),
    value: mjs.unit("")
  }

  constructor(...args) {
    super(...args) // Construct Component superclass, passing all arguments
    // this.props.value come from parent, as does this.props.name
    this.onNameEdit = this.onNameEdit.bind(this)
    this.onValueEdit = this.onValueEdit.bind(this)
  }

  get name() {
    return this.props.name.toTex().replace(/([^\\])~/g, "$1").replace("$~", "")
  }

  set name(name) {
    this.props.onNameChange(texmp.parseTex(name))
  }

  onNameEdit(event) {
    if (typeof this.props.onNameChange == "function") {
      // TODO: Data validation
      this.name = event.target.latex()
    }
  }

  onValueEdit(event) {
    if (typeof this.props.onValueChange == "function") {
      // TODO: Data validation
      const value = event.target.parent.innerFields[1].text()
      const unit = event.target.parent.innerFields[2].text()
      const newValue = mjs.unit(value + " " + unit)
      this.props.onValueChange(newValue)
    }
   }

  render() {
    let rhtml = html.bind({Equation})
    const [value, ...units] = this.props.value.toString().split(" ")
    const unit = units.join(" ").replace(/^(?:\((.+)\)|(.+))\/(?:\((.+)\)|(.+))$/, "\\frac{$1$2}{$3$4}")
    return rhtml`
    <Equation className="constant" innerFieldHandlers=${[{onEnter: this.onNameEdit}, {onEnter: this.onValueEdit}, {onEnter: this.onValueEdit}]}>
      \MathQuillMathField{${this.name}} = \MathQuillMathField{${value}} \left[ \MathQuillMathField{${unit}} \right]
    </Equation>
    `
  }

}
