import html from "./html.js"

class Test extends React.Component {
  render() {
    return html`<div>Hello ${this.props.toWhat}!</div>`
  }
}

class DynamicTest extends React.Component {
  constructor(...args) {
    super(...args) // Construct Component superclass, passing all arguments
    this.state = {subject: this.props.subject}

    setTimeout(() => {
      this.setState({ subject: this.props.newSubject })
    }, this.props.delay)
  }

  render() {
    return html`<${Test} toWhat=${this.state.subject}/>`
  }
}

// let test = React.createElement(DynamicTest, {subject: "World", newSubject: "Bees", delay: 2000})
let test = html`<${DynamicTest} subject="World" newSubject="Physics" delay=2000/>`

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(test)
