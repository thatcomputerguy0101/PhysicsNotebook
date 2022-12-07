import html from "../html.js"

export class ManipulationItem extends React.Component {
  render() {
    if (symbol.startsWith("http")) {
      return html`<img href=${this.props.symbol} onClick=${}/>`
    } else {
      return html`<span onClick=${}>${this.props.symbol}</span>`
    }
  }
}
