
export class ConstantData {
  constructor(name, value, id) {
    this.name = name ?? new mathjs.SymbolNode("")
    this.value = value ?? mathjs.unit("")
    this.id = id ?? crypto.randomUUID()
  }
}
