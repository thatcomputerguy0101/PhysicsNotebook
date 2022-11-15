import html from "../html.js"

export class App extends React.Component {
  render() {
    let rhtml = html.bind({})
    return rhtml`
    <div className="app">
      <header></header>
      <aside></aside>
      <main></main>
      <aside></aside>
    </div>`
  }
}
