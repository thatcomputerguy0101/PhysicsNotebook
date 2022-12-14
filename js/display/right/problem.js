import html from "../html.js"

export class Problem extends React.Component {
  render() {
    return html`
      <div className="problem" onClick=${null}>
        ${this.props.name}
      </div>
    `
  }
}
