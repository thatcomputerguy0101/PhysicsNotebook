import html from "../html.js"
import { Problem } from "./problem.js"

export class Workbook extends React.Component {
  render() {
    let rhtml = html.bind({ Problem })
    return html`
      <header>
        <img src="./icons/collapse.svg"/>
        <div> Problems </div>
        <img src="./icons/plus.svg"/>
      </header>
      ${
        this.props.problems.map(problem =>
          rhtml`<Problem key=${problem.id}
                         name=${problem.name}/>`
        )
      }
    `
  }
}
