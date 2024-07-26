import html from "./html.js"
import { ConstantBank } from "./left/constantBank.js"
import { ProblemSpace } from "./center/problemSpace.js"
import { EquationBank } from "./bottom/equationBank.js"
import { Workbook } from "./right/workbook.js"

const activeProblemCache = Symbol("activeProblemCache")

export class Workspace extends React.Component {
  constructor(...args) {
    super(...args)
    this.state = {
      leftOpen: true,
      rightOpen: true,
      bottomOpen: true,
    }
  }

  get workbook() {
    return this.props.workbook
  }

  set workbook(workbook) {
    if (typeof this.props.onWorkbookChange == "function") {
      this.props.onWorkbookChange(workbook)
    }
  }

  updateActiveProblem(problem) {
    if (problem == undefined) {
      problem = this.workbook.problems.find(problem => problem.id == this.workbook.activeProblemId)
    }
    this[activeProblemCache] = problem
  }

  get activeProblem() {
    return this[activeProblemCache]
  }

  set activeProblem(problem) {
    this.setProblem(problem, true)
    this.updateActiveProblem(problem)
  }

  setProblem(problem, active=false) {
    let i = this.workbook.problems.findIndex(oldProblem => oldProblem.id == problem.id)
    if (i != -1) {
      // Problem already exists, so update it
      this.workbook = {
        ...this.workbook,
        problems: this.workbook.problems.slice(0, i).concat([problem], this.workbook.problems.slice(i + 1)),
        activeProblemId: active ? problem.id : this.workbook.activeProblemId
      }
    } else {
      // Problem has a new id, so add it
      this.workbook = {
        ...this.workbook,
        problems: this.workbook.problems.concat([problem]),
        activeProblemId: active ? problem.id : this.workbook.activeProblemId
      }
    }
  }

  setProblems(problems) {
    this.workbook = {...this.workbook, problems}
    if (!problems.includes(this[activeProblemCache])) {
      updateActiveProblem()
      if (this[activeProblemCache] === undefined) {
        setProblem(problems[0], true)
      }
    }
  }

  get constants() {
    return this.activeProblem.constants
  }

  set constants(constants) {
    this.setProblem({
      ...this.activeProblem,
      constants: constants
    })
  }

  get equations() {
    return this.activeProblem.equations
  }

  set equations(equations) {
    this.setProblem({
      ...this.activeProblem,
      equations: equations
    })
  }

  render() {
    let rhtml = html.bind({ ConstantBank, ProblemSpace, EquationBank, Workbook })
    this.updateActiveProblem()

    return rhtml`
      <aside className=${this.state.leftOpen ? null : "collapsed"}>
        <ConstantBank constants=${this.constants}
                      onChange=${constants => this.constants = constants}
                      onToggleCollapsed=${() => this.setState(state => ({ leftOpen: !state.leftOpen }))}/>
      </aside>
      <main>
        <ProblemSpace equations=${this.equations} constants=${this.constants} onChange=${equations => this.equations = equations}/>
        <footer className=${this.state.bottomOpen ? null : "collapsed"}>
          <EquationBank onCreate=${equation => this.equations = this.equations.concat(equation)}
                        onToggleCollapsed=${() => this.setState(state => ({ bottomOpen: !state.bottomOpen }))}/>
        </footer>
      </main>
      <aside className=${this.state.rightOpen ? null : "collapsed"}>
        <Workbook name=${this.workbook.name}
                  problems=${this.workbook.problems}
                  onSelectProblem=${problem => this.activeProblem = problem}
                  onProblemsChange=${problems => this.workbook = { ...this.workbook, problems }}
                  onToggleCollapsed=${() => this.setState(state => ({ rightOpen: !state.rightOpen }))}/>
      </aside>
    `
  }
}