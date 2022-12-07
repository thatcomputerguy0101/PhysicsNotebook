import html from "../html.js"
import { EquationHistory } from "./equationHistory.js"

export class ProblemSpace extends React.Component {
  render() {
    let rhtml = html.bind({ EquationHistory }) 
    return rhtml`<div className="equations">
      ${this.props.equations.map(equation =>
        rhtml`<EquationHistory key=${equation.id} states=${equation.states}/>`
      )}
    </div>`
  }
}
