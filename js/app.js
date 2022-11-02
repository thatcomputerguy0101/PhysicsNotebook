import html from "./html.js"

class Test extends React.Component {
  render() {
    return html`<div>Hello ${this.props.toWhat}!</div>`
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(Test, {toWhat: 'World'}, null));
