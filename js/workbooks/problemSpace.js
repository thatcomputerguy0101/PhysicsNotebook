import html from "../html.js"
import { EquationHistory } from "./equationHistory.js"

export class ProblemSpace extends React.Component {

  get equations() {
    return this.props.equations
  }

  set equations(equations) {
    if (typeof this.props.onChange == "function") {
      this.props.onChange(equations)
    }
  }

  updateEquation(equation, states) {
    let index = this.equations.findIndex(equationI => equationI.id == equation.id)
    if (index != -1) {
      // Equation already exists, so update it
      this.equations = this.equations.slice(0, index).concat([{
        ...equation,
        states
      }], this.equations.slice(index + 1))
    } else {
      // Equation has a new id, so add it
      this.equations = this.equations.concat([{
        ...equation,
        states
      }])
    }
  }

  render() {
    let rhtml = html.bind({ EquationHistory })
    return rhtml`<section className="equations">
      ${this.props.equations.map(equation =>
        rhtml`<EquationHistory key=${equation.id} states=${equation.states} onChange=${states => this.updateEquation(equation, states)}/>`
      )}
    </section>`
  }
}
