import { ConstantData } from "./constnatData.js"

export class ProblemData {
  constructor(name, equations, constants, id) {
    this.name = name ?? ""
    this.equations = equations ?? []
    this.constants = constants ?? [new ConstantData()]
    this.id = id ?? crypto.randomUUID()
  }
}
