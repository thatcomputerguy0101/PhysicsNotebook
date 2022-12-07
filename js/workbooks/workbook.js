import html from "../html.js"
import { Problem } from "./problem.js"

export class Workbook extends React.Component {
  render(){
    let rhtml = html.bind({ Problem })
    return html`
      ${
        this.props.problems.map(problem =>
          rhtml`<Problem key=${problem.id}
                         name=${problem.name}
                         constants=${problem.constants}
                         equations=${problem.equations}
                         root=${this.props.problemRoot}
                         constantRoot=${this.props.constantRoot}
                />`
        )
      }
    `
  }
}
