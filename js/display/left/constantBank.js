import html from "../html.js"
import mjs from "../../mathjs/index.js"
import { Constant } from "./constant.js"
import { ConstantData } from "../../files/constantData.js"

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
    this.setConstant(new ConstantData())
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
        <img src="./icons/plus.svg" onClick=${this.addConstant}/>
        <div> Givens </div>
        <img id="collapseLeft" src="./icons/collapse.svg" onClick=${this.props.onToggleCollapsed}/>
      </header>
      <div className="constantBank">
        ${this.constants.map((constant, i) =>
          rhtml`<Constant key=${constant.id}
                          name=${constant.name}
                          value=${constant.value}
                          onNameChange=${name => this.setConstant(constant.setName(name), i)}
                          onValueChange=${value => this.setConstant(constant.setValue(value), i)}/>`
        )}
      </div>
    `
  }
}
