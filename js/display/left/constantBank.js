import html from "../html.js"
import mjs from "../../mathjs/index.js"
import { Constant } from "./constant.js"

export class ConstantBank extends React.Component {
  constructor(...args) {
    super(...args)
    this.addConstant = this.addConstant.bind(this)
  }

  setConstant(constant, i=undefined) {
    if (typeof this.props.onChange == "function") {
      if (i == undefined) {
        i = this.constants.findIndex(constI => constI.id == constant.id)
      }
      if (i != -1) {
        // Constant exists
        this.constants = this.constants.slice(0, i).concat([constant], this.constants.slice(i + 1))
      } else {
        // Constant is new
        this.constants = this.constants.concat([constant])
      }
    }
  }

  addConstant() {
    this.setConstant({
      id: crypto.randomUUID(),
      name: new mjs.SymbolNode(""),
      value: mjs.unit("")
    })
  }

  get constants() {
    return this.props.constants
  }

  set constants(constants) {
    this.props.onChange(constants)
  }

  render() {
    let rhtml = html.bind({Constant})
    return html`
      <header>
        <img src="/icons/plus.svg" onClick=${this.addConstant}/>
        <div> Givens </div>
        <img id="collapseLeft" src="/icons/collapse.svg"/>
      </header>
      ${this.constants.map((constant, i) =>
        rhtml`<Constant key=${constant.id}
                        name=${constant.name}
                        value=${constant.value}
                        onNameChange=${name => this.setConstant({...constant, name}, i)}
                        onValueChange=${value => this.setConstant({...constant, value}, i)}/>`
      )}
    `
  }
}
