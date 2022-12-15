import html from "../html.js"
import mjs from "../../mathjs/index.js"
import { EquationHistory } from "./equationHistory.js"

const solvedEquations = Symbol("solvedEquations")

export class ProblemSpace extends React.Component {
  updateSolvedEquations() {
    const lastStates = this.equations.map(
      equation => equation.states[equation.states.length - 1]
    )
    this[solvedEquations] = lastStates.filter(lastState => {
      return mjs.simplify(lastState, mjs.expandSolvable("vl == n").map(pattern => ({l: pattern, r: "valid()"}))).equals(mjs.parse("valid()"))
    }).map(lastState => ({name: lastState.args[0], valueNode: lastState.args[1]})).concat(
      lastStates.filter(lastState => {
        return mjs.simplify(lastState, mjs.expandSolvable("n == vl").map(pattern => ({l: pattern, r: "valid()"}))).equals(mjs.parse("valid()"))
      }).map(lastState => ({name: lastState.args[1], valueNode: lastState.args[0]}))
    )
  }

  get constants() {
    return this.props.constants.concat(this[solvedEquations])
  }

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
    this.updateSolvedEquations()
    let rhtml = html.bind({ EquationHistory })
    return rhtml`<section className="equations">
      ${this.props.equations.map(equation =>
        rhtml`<EquationHistory key=${equation.id}
                               states=${equation.states}
                               scope=${this.constants}
                               onChange=${states => this.updateEquation(equation, states)}/>`
      )}
    </section>`
  }
}
