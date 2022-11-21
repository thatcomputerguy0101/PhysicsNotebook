import html from "../html.js"

export class App extends React.Component {
  render() {
    let rhtml = html.bind({})
    return rhtml`
    <div className="app">
      <header>
        <img id="logo" src="/icons/logo.svg"/>
        <div> Physics Notebook </div>
        <img id="share" src="/icons/share.svg"/>
        <img id="help" src="/icons/help.svg"/>
        <img id="profile" src="/icons/profile.svg"/>
        <img id="settings" src="/icons/settings.svg"/>
      </header>
      <aside>
        <header>
          <img src="/icons/plus.svg"/>
          <div> Givens </div>
          <img id="collapseLeft" src="/icons/collapse.svg"/>
        </header>
      </aside>
      <main>
        <section></section>
        <footer>
          <header>
            <div> Equations </div>
            <img id="collapseDown" src="/icons/collapse.svg"/>
          </header>
        </footer>
      </main>
      <aside>
        <header>
          <img src="/icons/collapse.svg"/>
          <div> Problems </div>
          <img src="/icons/plus.svg"/>
        </header>
      </aside>
    </div>`
  }
}
