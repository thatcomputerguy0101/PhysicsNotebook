import html from "../html.js"
import { EquationState } from "./equationState.js"

export class EquationHistory extends React.Component {
  render() {
    let rhtml = html.bind({EquationState})
    return html`
      <div className="equationHistory">
        ${this.props.states.map((state, index) =>
            rhtml`<EquationState key=${index} value=${state} onManipulate=${null}/>`
        )}
      </div>
    `
  }
}
