import html from "./html.js"
import { Equation } from "./equationPacks/equation.js"
import { Constant } from "./constant.js"
import { EquationState } from "./workbooks/equationState.js"

class Test extends React.Component {
  render() {
    let rhtml = html.bind({Equation, Constant, EquationState})
    return rhtml`
    <div>
      Hello ${this.props.toWhat}!<br/>
      <Equation>\Sigma F = m \cdot a</Equation><br/>
      <Constant name="g" value=5/><br/>
      <EquationState value="F_g=m a_g"/>
    </div>`
  }
}

class DynamicTest extends React.Component {
  constructor(...args) {
    super(...args) // Construct Component superclass, passing all arguments
    this.state = {subject: this.props.subject}
  }

  componentDidMount() {
    this.timerId = setTimeout(() => {
      this.setState({ subject: this.props.newSubject })
    }, this.props.delay)
  }

  componentWillUnmount() {
    clearTimeout(this.timerId)
  }

  render() {
    return html`<${Test} toWhat=${this.state.subject}/>`
  }
}

// These two lines are equivalent:
// let test = React.createElement(DynamicTest, {subject: "World", newSubject: "Bees", delay: 2000})
let test = html`<${DynamicTest} subject="World" newSubject="Physics" delay=2000/>`

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(test)
