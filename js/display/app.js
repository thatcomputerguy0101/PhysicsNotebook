import html from "../html.js"

export class App extends React.Component {
  render() {
    let rhtml = html.bind({Equation})
    return rhtml`
    <div class="app">
      <header></header>
      <aside></aside>
      <main></main>
      <aside></aside>
    </div>`
  }
}
