
export class EquationData {
  constructor(states, id) {
    this.states = states
    this.id = id ?? crypto.randomUUID()
  }
}
