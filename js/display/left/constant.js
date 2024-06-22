import html from "../html.js"
import mjs from "../../mathjs/index.js"
import { Equation } from "../equation.js"

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
    return mjs.fixTex(this.props.name.toTex())
  }

  set name(name) {
    this.props.onNameChange(texmp.parseTex(name))
  }

  onNameEdit(event) {
    if (typeof this.props.onNameChange == "function") {
      // TODO: Data validation (name uniqueness, validity as a symbol, etc.)
      this.name = event.target.latex()
    }
  }

  checkName() {
    return /^\s*(?:\\Sigma)?\s*(?:\\Delta)?\s*(?:\w|\\\w+)\s*(?:_(?:\{\s*[\\\w\s]+\s*\}|[\\\w\s]+))?\s*$/.test(this.name)
  }

  onValueEdit(event) {
    if (typeof this.props.onValueChange == "function") {
      // TODO: Data validation
      const value = event.target.parent.innerFields[1].text()
      const unit = event.target.parent.innerFields[2].text()
      let newValue
      try {
        newValue = mjs.unit(value + " " + unit)
        this.props.onValueChange(newValue)
      } catch (SyntaxError) {
        this.props.value.error = true
        this.props.onValueChange(this.props.value)
      }
    }
  }

  checkValue() {
    // TODO: check user input instead of saved data
    return this.props.value.value != null || (this.props.value.error ?? false) // value.value should be int for valid data
  }

  render() {
    let rhtml = html.bind({Equation})
    const value = this.props.value.value?.toString() ?? ""
    const unit = this.props.value.formatUnits().replace(/^(?:\((.+)\)|(.+))\/(?:\((.+)\)|(.+))$/, "\\frac{$1$2}{$3$4}")
    return rhtml`
    <Equation className=${"constant" + (this.checkName() ? "" : " invalidName") + (this.checkValue() ? "" : " invalidValue") + (this.checkValue() ? "" : " invalidUnit")}
              innerFieldHandlers=${[
                {onEnter: this.onNameEdit, onBlur: this.onNameEdit},
                {onEnter: this.onValueEdit, onBlur: this.onValueEdit},
                {onEnter: this.onValueEdit, onBlur: this.onValueEdit}
              ]}>
      \MathQuillMathField{${this.name}} = \MathQuillMathField{${value}} \left[ \MathQuillMathField{${unit}} \right]
    </Equation>
    `
  }

}
