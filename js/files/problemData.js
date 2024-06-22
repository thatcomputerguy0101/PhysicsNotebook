import { ConstantData } from "./constantData.js"

export class ProblemData {
  constructor(name, constants, equations, id) {
    this.name = name ?? ""
    this.constants = constants ?? [new ConstantData()]
    this.equations = equations ?? []
    this.id = id ?? crypto.randomUUID()
  }
  
  setName(name) {
    return new ProblemData(name, this.constants, this.equation, this.id)
  }
}
