import html from "../html.js"

export class HelpMenu extends React.Component {
  static pages = [
    {
      image: "/images/help0.png",
      content: "This is totally a helpful menu"
    }
  ]

  constructor(...args) {
    super(...args)
    this.state = {
      x: window.innerWidth / 2 - 250,
      y: window.innerHeight / 2 - 200,
      page: 0
    }
    this.onPointerDown = this.onPointerDown.bind(this)
    this.onPointerMove = this.onPointerMove.bind(this)
    this.onPointerUp = this.onPointerUp.bind(this)
    this.nextPage = this.nextPage.bind(this)
    this.prevPage = this.prevPage.bind(this)
    this.close = this.close.bind(this)
  }

  onPointerDown(event) {
    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  onPointerMove(event) {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      this.setState(state => ({
        x: state.x + event.movementX,
        y: state.y + event.movementY
      }))
    }
  }

  onPointerUp(event) {
    event.currentTarget.releasePointerCapture(event.pointerId)
  }

  nextPage() {
    if (this.state.page < this.constructor.pages.length) {
      this.setState(state => ({page: state.page + 1}))
    }
  }

  prevPage() {
    if (this.state.page > this.constructor.pages.length) {
      this.setState(state => ({page: state.page + 1}))
    }
  }

  close() {
    if (typeof this.props.onClose == "function") {
      this.props.onClose()
    }
  }

  render() {
    return html`
      <section className="helpMenu" style=${{left: this.state.x, top: this.state.y}}>
        <header onPointerDown=${this.onPointerDown}
                onPointerMove=${this.onPointerMove}
                onPointerUp=${this.onPointerUp}>
          PhysicsNotebook Help
          <span onClick=${this.close}>⨯</span>
        </header>
        <main>
          <img src=${this.constructor.pages[this.state.page].image}/>
          ${this.constructor.pages[this.state.page].content}
        </main>
        <footer>
          <button className="prev"
                  onClick=${this.prevPage}
                  disabled=${this.state.page <= 0}>
            Prev
          </button>
          <button className="next"
                  onClick=${this.prevPage}
                  disabled=${this.state.page >= this.constructor.pages.length - 1}>
            Next
          </button>
        </footer>
      </section>
    `
  }
}
