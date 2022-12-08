import html from "../html.js"
import demoWorkbook from "../demo.js"
import { ConstantBank } from "./constantBank.js"
import { ProblemSpace } from "../workbooks/problemSpace.js"
import { Workbook } from "../workbooks/workbook.js"

const activeProblemCache = new Symbol("activeProblemCache")

export class App extends React.Component {
  constructor(...args) {
    super(...args)
    this.state = {
      workbook: demoWorkbook()
    }
  }

  get workbook() {
    return this.state.workbook
  }

  set workbook(workbook) {
    this.state.set({workbook})
  }

  addProblem(problem) {
    this.workbook = {
      ...this.state.workbook,
      problems: problems.concat([problem])
    }
  }

  updateActiveProblem(problem) {
    if (problem == undefined) {
      problem = this.state.workbook.problems.find(problem => problem.active == true)
    }
    this[activeProblemCache] = problem
  }

  get activeProblem() {
    return this[activeProblemCache]
  }

  set activeProblem(problem) {
    this.setProblem({...this.activeProblem, active: false})
    this.setProblem({...problem, active: true})
    this.updateActiveProblem(problem)
  }

  setProblem(problem) {
    if (problem.active == true && activeProblem.active == true && problem.id != activeProblem.id) {
      this.activeProblem = problem
      return
    }
    let problems = this.state.workbook
    this.workbook = {
      ...this.state.workbook,
      problems: problems.slice().splice(problems.findIndex(oldProblem => oldProblem.id), 1, problem)
    }
    if (problem.active == true) {
      this.updateActiveProblem()
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
      constants: constants
    })
  }

  render() {
    let rhtml = html.bind({ ConstantBank, ProblemSpace, Workbook })
    this.updateActiveProblem()

    return rhtml`
    <header className="header">
      <div className="iconsL">
        <img id="logo" src="/icons/logo.svg"/>
      </div>
      <div className="title" id="title"> Physics Notebook </div>
      <div className="iconsR">
        <img id="share" src="/icons/share.svg"/>
        <img id="help" src="/icons/help.svg"/>
        <img id="profile" src="/icons/profile.svg"/>
        <img id="settings" src="/icons/settings.svg"/>
      </div>
    </header>
    <div className="app">
      <aside>
        <header>
          <img src="/icons/plus.svg"/>
          <div> Givens </div>
          <img id="collapseLeft" src="/icons/collapse.svg"/>
        </header>
        <ConstantBank constants=${this.constants} onChange=${constants => this.constants = constants}/>
      </aside>
      <main>
        <ProblemSpace equations=${this.equations} onChange=${equations => this.equations = equations}/>
        <footer>
          <header>
            <div> Equations </div>
            <img id="collapseDown" src="/icons/collapse.svg"/>
          </header>
        </footer>
      </main>
      <aside>
        <header>
          <img src="/icons/collapse.svg"/>
          <div> Problems </div>
          <img src="/icons/plus.svg"/>
        </header>
        <Workbook name=${this.workbook.name} problems=${this.problems} onSelectProblem=${problem => this.activeProblem = problem}/>
      </aside>
    </div>`
  }
}
