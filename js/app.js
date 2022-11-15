import html from "./html.js"
import { Equation } from "./equationPacks/equation.js"
import { Constant } from "./workbooks/constant.js"
import { EquationState } from "./workbooks/equationState.js"
import { App } from "./display/app.js"
import "./manipulations/selection.js"

class Test extends React.Component {
  render() {
    let rhtml = html.bind({Equation, Constant, EquationState})
    return rhtml`
    <div>
      Hello ${this.props.toWhat}!<br/>
      <Equation>${this.props.forces} = m \cdot a</Equation><br/>
      <Constant name="g" value=5/><br/>
      <EquationState value="F_g=m a_g"/>
    </div>`
  }
}

class DynamicTest extends React.Component {
  constructor(...args) {
    super(...args) // Construct Component superclass, passing all arguments
    this.state = {
      subject: this.props.subject,
      forces: "\\Sigma F",
      appTest: false
    }
  }

  componentDidMount() {
    this.timerId = setTimeout(() => {
      this.setState({ subject: this.props.newSubject, forces: "F_g + F_T" })
    }, this.props.delay)
  }

  componentWillUnmount() {
    clearTimeout(this.timerId)
  }

  render() {
    if (this.state.appTest) {
      let rhtml = html.bind({App})
      return rhtml`
      <App/>
      `
    } else {
      return html`
      <${Test} toWhat=${this.state.subject} forces=${this.state.forces}/>
      <button onClick=${e => this.setState({ appTest: true })}>Test site</button>
      `
    }
  }
}

// These two lines are equivalent:
// let test = React.createElement(DynamicTest, {subject: "World", newSubject: "Bees", delay: 2000})
let test = html`<${DynamicTest} subject="World" newSubject="Physics" delay=2000/>`

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(test)
