import html from "../html.js"
import { Problem } from "./problem.js"
import { ProblemData } from "../../files/problemData.js"


export class Workbook extends React.Component {
  constructor(...args) {
    super(...args)
    this.addProblem = this.addProblem.bind(this)
  }

  setProblem(problem, i=undefined) {
    if (typeof this.props.onProblemsChange == "function") {
      if (i == undefined) {
        i = this.problems.findIndex(constI => constI.id == constant.id)
      }
      if (i != -1) {
        // Constant exists
        this.problems = this.problems.slice(0, i).concat([constant], this.constants.slice(i + 1))
      } else {
        // Constant is new
        this.problems = this.problems.concat([constant])
      }
    }
  }

  addProblem() {
    const newProblem = new ProblemData(`Problem ${this.problems.length + 1}`)
    this.problems = this.problems.concat(newProblem)
  }

  get problems() {
    return this.props.problems
  }

  set problems(problems) {
    this.props.onProblemsChange(problems)
  }

  render() {
    let rhtml = html.bind({ Problem })
    return html`
      <header>
        <img src="./icons/collapse.svg"/>
        <div> Problems </div>
        <img src="./icons/plus.svg" onClick=${this.addProblem}/>
        </header>
        ${
          this.props.problems.map((problem, i) =>
            rhtml`<Problem key=${problem.id}
                           name=${problem.name}
                           onClick=${() => this.props.onSelectProblem(problem)}
                           onNameChange=${() => this.setProblem(problem.setName(name), i)}/>`
          )
        }
    `
  }
}
