
export class EquationData {
  constructor(states, id) {
    this.states = Array.isArray(states) ? states : states != undefined ? [states] : []
    this.id = id ?? crypto.randomUUID()
  }
}
