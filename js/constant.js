import html from "./html.js"
import { Equation } from "./equationPacks/equation.js"

export class Constant extends React.Component {
  constructor(...args) {
    super(...args) // Construct Component superclass, passing all arguments
    // this.props.value come from parent, as does this.props.name
    this.onClick = this.onClick.bind(this)
    this.state = {
      name: this.props.name,
      value: this.props.value,
      editable: false
    }
  }

  onClick(event) {
    // Open equation editing menu here
    this.setState({
      editable: true
    })
  }

  render() {
    let rhtml = html.bind({Equation})
    if (this.state.editable) {
      return rhtml`
      <Equation>
        \MathQuillMathField{${this.state.name}} = \MathQuillMathField{${this.state.value}}
      </Equation>
      `
    } else {
      return rhtml`
      <Equation>
        ${this.state.name} = ${this.state.value}
      </Equation>
      `
    }
  }


}
