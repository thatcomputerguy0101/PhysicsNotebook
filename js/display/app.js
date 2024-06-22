import html from "./html.js"
import demoWorkbook from "../files/demo.js"
import { ConstantBank } from "./left/constantBank.js"
import { ProblemSpace } from "./center/problemSpace.js"
import { EquationBank } from "./bottom/equationBank.js"
import { Workbook } from "./right/workbook.js"
import { HelpMenu } from "./overlay/helpMenu.js"

const activeProblemCache = Symbol("activeProblemCache")

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
    this.setState({workbook})
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
    let rhtml = html.bind({ ConstantBank, ProblemSpace, EquationBank, Workbook, HelpMenu })
    this.updateActiveProblem()

    return rhtml`
    <header className="header">
      <div className="iconsL">
        <img id="logo" src="./icons/logo.svg"/>
      </div>
      <div className="title" id="title"> Physics Notebook </div>
      <div className="iconsR">
        <img id="share" src="./icons/share.svg"/>
        <img id="help" src="./icons/help.svg" onClick=${() => this.setState({showHelp: true})}/>
        <img id="profile" src="./icons/profile.svg"/>
        <img id="settings" src="./icons/settings.svg"/>
      </div>
    </header>
    ${
      this.state.showHelp
        ? rhtml`<HelpMenu onClose=${() => this.setState({showHelp: false})}/>`
        : html`<React.Fragment/>`
    }
    <div className="app">
      <aside>
        <ConstantBank constants=${this.constants} onChange=${constants => this.constants = constants}/>
      </aside>
      <main>
        <ProblemSpace equations=${this.equations} constants=${this.constants} onChange=${equations => this.equations = equations}/>
        <footer>
          <header>
            <div> Equations </div>
            <img id="collapseDown" src="./icons/collapse.svg"/>
          </header>
          <EquationBank onCreate=${equation => this.equations = this.equations.concat(equation)}/>
        </footer>
      </main>
      <aside>
        <Workbook name=${this.workbook.name}
                  problems=${this.workbook.problems}
                  onSelectProblem=${problem => this.activeProblem = problem}
                  onProblemsChange=${problems => this.workbook = {...this.workbook, problems}}/>
      </aside>
    </div>`
  }
}
