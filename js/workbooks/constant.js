import html from "../html.js"
import { Equation } from "../equationPacks/equation.js"

export class Constant extends React.Component {
  constructor(...args) {
    super(...args) // Construct Component superclass, passing all arguments
    // this.props.value come from parent, as does this.props.name
    this.onClick = this.onClick.bind(this)
    this.state = {
      name: this.props.name,
      value: this.props.value,
      editable: true
    }
  }

  onClick(event) {
    // Open equation editing menu here
    this.setState({
      editable: true
    })
    console.log(`${this.state.name} was clicked`)
  }

  render() {
    let rhtml = html.bind({Equation})
    const name = this.state.name.toTex().replace(/([^\\])~/g, "$1").replace("$~", "")
    const [value, ...units] = this.state.value.toString().split(" ")
    const unit = units.join(" ").replace(/^(.+)\/(.+)$/, "\\frac{$1}{$2}")
    if (this.state.editable) {
      return rhtml`
      <Equation onClick=${this.onClick}>
        \MathQuillMathField{${name}} = \MathQuillMathField{${value}} \left[ \MathQuillMathField{${unit}} \right]
      </Equation>
      `
    } else {
      return rhtml`
      <Equation onClick=${this.onClick}>
        ${name} = ${value} \left[ ${unit} \right]
      </Equation>
      `
    }
  }

}
