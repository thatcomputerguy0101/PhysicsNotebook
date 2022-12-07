import html from "../html.js"
import { Constant } from "../workbooks/constant.js"

export class ConstantBank extends React.Component {
  render() {
    let rhtml = html.bind({Constant})
    return html`
      ${this.props.constants.map(constant =>
        rhtml`<Constant key=${constant.id} name=${constant.name} value=${constant.value}/>`
      )}
    `
  }
}
