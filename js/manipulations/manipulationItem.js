import html from "../html.js"
import { Equation } from "../equationPacks/equation.js"

export class ManipulationItem extends React.Component {
  render() {
    if (this.props.symbol.startsWith("http")) {
      return html`<img src=${this.props.symbol} onClick=${this.props.apply}/>`
    } else {
      let rhtml = html.bind({ Equation })
      return rhtml`<Equation onClick=${this.props.apply}>${this.props.symbol}</Equation>`
    }
  }
}
