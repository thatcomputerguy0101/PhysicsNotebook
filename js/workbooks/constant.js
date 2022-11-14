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
    if (this.state.editable) {
      return rhtml`
      <Equation onClick=${this.onClick}>
        \MathQuillMathField{${this.state.name}} = \MathQuillMathField{${this.state.value}} \left[ \MathQuillMathField{${this.state.unit}} \right]
      </Equation>
      `
    } else {
      return rhtml`
      <Equation onClick=${this.onClick}>
        ${this.state.name} = ${this.state.value} \left[ ${this.state.unit} \right]
      </Equation>
      `
    }
  }

}
