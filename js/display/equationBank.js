import html from "../html.js"
import { EquationBankCategory as Category } from "./equationBankCategory.js"
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

  createEquation(equation) {
    if (typeof this.props.onCreate == "function") {
      this.props.onCreate(equation)
    }
  }

  toggleCategory(i) {
    this.setState({
      ...this.state,
      categoriesOpen: this.state.categoriesOpen.slice(0, i).concat(!this.state.categoriesOpen[i], this.state.categoriesOpen.slice(i + 1))
    })
  }

  render() {
    let rhtml = html.bind({ Category })
    return html`
      <div className="equationBank">
      ${
      this.pack.categories.map((category, i) => rhtml`
        <Category name=${category.name}
                  equations=${category.equations}
                  open=${this.state.categoriesOpen[i]}
                  onClick=${() => this.toggleCategory(i)}/>
      `)
      }
      </div>
    `
    /**/
  }
}
