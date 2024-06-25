import html from "./html.js"
import demoWorkbook from "../files/demo.js"
import { Workspace } from "./workspace.js"
import { HelpMenu } from "./overlay/helpMenu.js"

export class App extends React.Component {
  constructor(...args) {
    super(...args)
    this.state = {
      workbook: demoWorkbook(),
      showHelp: false,
    }
  }

  get workbook() {
    return this.state.workbook
  }

  set workbook(workbook) {
    this.setState({workbook})
  }

  render() {
    let rhtml = html.bind({ Workspace, HelpMenu })

    return rhtml`
      <header className="header">
        <div className="iconsL">
          <img id="logo" src="./icons/logo.svg"/>
        </div>
        <div className="title" id="title"> Physics Notebook </div>
        <div className="iconsR">
          <img id="share" src="./icons/share.svg" disabled/>
          <img id="help" src="./icons/help.svg" onClick=${() => this.setState({showHelp: true})}/>
          <img id="profile" src="./icons/profile.svg" disabled/>
          <img id="settings" src="./icons/settings.svg" disabled/>
        </div>
      </header>
      ${
        this.state.showHelp
          ? rhtml`<HelpMenu onClose=${() => this.setState({showHelp: false})}/>`
          : null
      }
      <div className="app">
        <Workspace workbook=${this.workbook} onWorkbookChange${workbook => this.workbook = workbook}/>
      </div>
    `
  }
}
