const e = React.createElement

class Test extends React.Component {
  render() {
    return e("div", null, "Hello", this.props.toWhat)
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(Test, {toWhat: 'World'}, null));
