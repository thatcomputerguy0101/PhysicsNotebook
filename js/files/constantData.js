export class ConstantData {
  constructor(name, value, id=undefined) {
    this.name = name
    this.value = value
    if (id == undefined) {
      this.id = crypto.randomUUID()
    } else {
      this.id = id
    }
  }
}
