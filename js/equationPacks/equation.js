import html from "../html.js"

export class Equation extends React.Component {
  constructor(...args) {
    super(...args)
    this.mqRef = React.createRef()
  }

  componentDidMount() {
    // When added to the visible structure
    MQ.MathField(this.mqRef.current)
  }

  render() {
    return html`<div ref=${this.mqRef}/>`
  }
}
