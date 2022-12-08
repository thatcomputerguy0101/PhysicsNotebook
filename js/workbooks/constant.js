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
    this.onClick = this.onClick.bind(this)
    this.onNameEdit = this.onNameEdit.bind(this)
    this.onValueEdit = this.onValueEdit.bind(this)
    this.state = {
      editable: true
    }
  }

  get name() {
    return this.props.name.toTex().replace(/([^\\])~/g, "$1").replace("$~", "")
  }

  set name(name) {
    this.props.onNameChange(texmp.parseTex(name))
  }

  // TODO: getter/setter for value & unit

  onClick(event) {
    // Open constant editing menu here?
    this.setState({
      editable: true
    })
    console.log(`${this.state.name} was clicked`)
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
    const name = this.props.name.toTex().replace(/([^\\])~/g, "$1").replace("$~", "")
    const [value, ...units] = this.props.value.toString().split(" ")
    const unit = units.join(" ").replace(/^(?:\((.+)\)|(.+))\/(?:\((.+)\)|(.+))$/, "\\frac{$1$2}{$3$4}")
    if (this.state.editable) {
      return rhtml`
      <Equation className="constant" innerFieldHandlers=${[{onEnter: this.onNameEdit}, {onEnter: this.onValueEdit}, {onEnter: this.onValueEdit}]}>
        \MathQuillMathField{${name}} = \MathQuillMathField{${value}} \left[ \MathQuillMathField{${unit}} \right]
      </Equation>
      `
    } else {
      return rhtml`
      <Equation className="constant" onClick=${this.onClick}>
        ${name} = ${value} \left[ \mathrm {${unit}} \right]
      </Equation>
      `
    }
  }

}
