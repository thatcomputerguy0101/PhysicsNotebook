import html from "../html.js"
import mjs from "../../mathjs/index.js"
import { EquationState } from "./equationState.js"

export class EquationHistory extends React.Component {
  addState(newState, after=undefined) {
    if (typeof this.props.onChange == "function") {
      if (mjs.simplify(newState, mjs.expandSolvable("vl == ce").map(pattern => ({l: pattern, r: "valid()"}))).equals(mjs.parse("valid()"))) {
        newState = [newState, newState.map((node, i) => i == "args[1]" ? new mjs.ConstantNode(node.evaluate()) : node)]
      }

      if (after == undefined) {
        this.props.onChange(this.props.states.concat(newState))
      } else {
        this.props.onChange(this.props.states.slice(0, after + 1).concat(newState))
      }
    }
  }

  render() {
    let rhtml = html.bind({EquationState})
    return html`
      <div className="equationHistory">
        <div className="spacer"/>
        ${this.props.states.map((state, index) =>
            rhtml`<EquationState key=${state.toString()}
                                 value=${state}
                                 scope=${this.props.scope}
                                 onManipulate=${newState => this.addState(newState, index)}/>`
        )}
        <div className="spacer"/>
      </div>
    `
  }
}
