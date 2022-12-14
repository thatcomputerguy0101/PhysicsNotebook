export class EquationData {
  constructor(id, states) {
    this.id = id ?? crypto.randomUUID()
    this.states = states
  }
}
