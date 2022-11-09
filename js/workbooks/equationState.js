import html from "../html.js"
import { Equation } from "../equationPacks/equation.js"

export class EquationState extends React.Component {
  render() {
    let rhtml = html.bind({Equation})
    return rhtml`
    <Equation>
      ${this.props.value}
    </Equation>`
  }
}
