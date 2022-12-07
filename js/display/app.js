import html from "../html.js"
import demoWorkbook from "../demo.js"
import { ConstantBank } from "./constantBank.js"
import { ProblemSpace } from "../workbooks/problemSpace.js"
import { Workbook } from "../workbooks/workbook.js"

export class App extends React.Component {
  constructor(...args) {
    super(...args)
    this.state = {
      workbook: demoWorkbook()
    }
  }

  render() {
    let rhtml = html.bind({ ConstantBank, ProblemSpace, Workbook })
    let activeProblem = this.state.workbook.problems.find(problem => problem.active == true)

    return rhtml`
    <div className="app">
      <header>
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
      <aside>
        <header>
          <img src="/icons/plus.svg"/>
          <div> Givens </div>
          <img id="collapseLeft" src="/icons/collapse.svg"/>
        </header>
        <ConstantBank constants=${activeProblem.constants}/>
      </aside>
      <main>
        <section>
          <ProblemSpace equations=${activeProblem.equations}/>
        </section>
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
        <Workbook name=${this.state.workbook.name} problems=${this.state.workbook.problems}/>
      </aside>
    </div>`
  }
}
