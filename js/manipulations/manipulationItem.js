import html from "../html.js"

export class ManipulationItem extends React.Component {
  render() {
    if (symbol.startsWith("http")) {
      return html`<img src=${this.props.symbol} onClick=${this.props.apply}/>`
    } else {
      return html`<span onClick=${this.props.apply}>${this.props.symbol}</span>`
    }
  }
}
