import html from "../html.js"
import mjs from "../mathjs/index.js"
import { Equation } from "../equationPacks/equation.js"

export class EquationBankCategory extends React.Component {
  createEquation(equation) {
    if (typeof this.props.onCreate == "function") {
      this.props.onCreate(equation)
    }
  }

  render() {
    let rhtml = html.bind({ Equation })
    return html`
      <div>
        <div className=${"categoryHeader" + (this.props.open ? " open" : "")} onClick=${this.props.onClick}>
          ${this.props.name}
          <img src="../icons/dropdown.svg" width = 20px height = 20px/>
        </div>
        ${
          this.props.open
            ? html`<div className="category">${this.props.equations.map(equation => rhtml`
              <Equation onClick=${() => this.createEquation(equation)}>${mjs.fixTex(equation.toTex())}</Equation>
            `)}</div>`
            : html`<React.Fragment/>`
        }
      </div>
    `
  }
}
