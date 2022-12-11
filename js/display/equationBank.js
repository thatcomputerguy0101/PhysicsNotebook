import html from "../html.js"
import mjs from "../mathjs/index.js"
import { Equation } from "../equationPacks/equation.js"
import { EquationPack } from "../equationPacks/pack.js"

export class EquationBank extends React.Component {
  static defaultProps = {
    packName: "physics"
  }

  constructor(...args) {
    super(...args)
    this.pack = EquationPack[this.props.packName]
    if (this.pack == undefined) {
      throw new Error("Equation pack not found!")
    }
    this.state = {
      categoriesOpen: new Array(this.pack.length).fill(false)
    }
  }

  toggleCategory(i) {
    this.setState({
      ...this.state,
      categoriesOpen: this.state.categoriesOpen.slice(0, i).concat(!this.state.categoriesOpen[i], this.state.categoriesOpen.slice(i + 1))
    })
  }

  render() {
    let rhtml = html.bind({ Equation })
    return html`
      <div className="equationBank">
      ${
      this.pack.categories.map((category, i) => html`
        <div key=${"cat" + i} className="categoryHeader" onClick=${() => this.toggleCategory(i)}>
          ${category.name}
        </div>
        ${
          this.state.categoriesOpen[i]
            ? html`<div key=${"cat" + i + "con"} className="category">${category.equations.map((equation, j) => rhtml`
              <Equation>${mjs.fixTex(equation.toTex())}</Equation>
            `)}</div>`
            : html`<React.Fragment key=${"cat" + i + "con"}/>`
        }
      `)
      }
      </div>
    `
    /**/
  }
}
