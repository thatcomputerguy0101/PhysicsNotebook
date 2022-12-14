import { ProblemData } from "./problemData.js"

export class WorkbookData {
  constructor(name, problems, activeProblemId, id) {
    this.name = name ?? []
    this.problems = problems ?? [new ProblemData()]
    this.activeProblemId = activeProblemId ?? problems[0].id
    this.id = id ?? crypto.randomUUID()
  }
}
