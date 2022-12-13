import html from "../html.js"

export class HelpMenu extends React.Component {
  static pages = [
    {
      image: "../steps/Step1.png",
      content: "1. Go into the ‘Givens’ menu on the left side and click on the ‘+’ button to add your givens in."
    },
    {
      image: "../steps/Step2.png",
      content: "2.	Next, go to the ‘Problems’ menu on the right side and click on the ‘+’ button to add the relevant equations based on the problem's givens."
    },
    {
      image: "../steps/Step3.png",
      content: "3.	For different equations that you want to import based on the specific category of the Physics equation, select what category you want and expand the category with the dropdown arrow. Once you select the equation, it should appear in the workspace."
    },
    {
      image: "../steps/Step4.png",
      content: "4.	Select terms from equations in the workspace to show the available operations for that term. Click on an operation to perform it."
    },
    {
      image: "../steps/Step5.png",
      content: "5.	Continue performing operations. If you make a mistake, simply select text from a previous equation to get back on track."
    },
    // {
    //   image: "../steps/Step6.png",
    //   content: "6.	Once an equation is solved for an unknown variable in terms of known variables, select the equals sign or the whole equation to substitute in the givens and calculate the solution."
    // },
    // {
    //   image: "../steps/Step7.png",
    //   content: "7.	To move on to your next problem, click the plus button within the Problems pane. Click the name of problems to switch between them."
    // },
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
    if (this.state.page < this.constructor.pages.length) {
      this.setState(state => ({page: state.page - 1}))
    }
  }

  stop(event) {
    event.stopPropagation()
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
          <div className="close" onPointerDown=${this.stop} onClick=${this.close}>⨯</div>
        </header>
        <main>
          <div>
            <img className="stepImage" src=${this.constructor.pages[this.state.page].image}/>
          </div>
          ${this.constructor.pages[this.state.page].content}
        </main>
        <footer>
          <button className="prev"
                  onClick=${this.prevPage}
                  disabled=${this.state.page <= 0}>
            Prev
          </button>
          <button className="next"
                  onClick=${this.nextPage}
                  disabled=${this.state.page >= this.constructor.pages.length - 1}>
            Next
          </button>
        </footer>
      </section>
    `
  }
}
