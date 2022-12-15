import mjs from "../mathjs/index.js"

export class ConstantData {
  constructor(name, value, id) {
    this.name = name ?? new mjs.SymbolNode("")
    this.value = value ?? mjs.unit("")
    this.id = id ?? crypto.randomUUID()
  }

  get valueNode() {
    return new mjs.ConstantNode(this.value)
  }
}
