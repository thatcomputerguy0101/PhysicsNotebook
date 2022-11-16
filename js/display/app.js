import html from "../html.js"

export class App extends React.Component {
  render() {
    let rhtml = html.bind({})
    return rhtml`
    <div className="app">
      <header></header>
      <aside>
        <header>
          <img src="/icons/placeholder.svg"/>
          <div> Givens </div>
          <img src="/icons/placeholder.svg"/>
        </header>
      </aside>
      <main>
        <section></section>
        <footer></footer>
      </main>
      <aside>
        <header>
          <img src="/icons/placeholder.svg"/>
          <div> Problems </div>
          <img src="/icons/placeholder.svg"/>
        </header>
      </aside>
    </div>`
  }
}
