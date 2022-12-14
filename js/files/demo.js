import mjs from "../mathjs/index.js"
import { WorkbookData } from "./workbookData.js"
import { ProblemData } from "./problemData.js"
import { EquationData } from "./equationData.js"
import { ConstantData } from "./constantData.js"

export default function demoWorkbook() {
  // This is essentially a database stub while the app's features is still the primary development focus
  let data = {
    id: crypto.randomUUID(),
    name: "TestWorkbook",
    problems: [
      {
        id: crypto.randomUUID(),
        name: "TestProblem",
        constants: [
            new ConstantData(new mjs.SymbolNode("a"), mjs.unit("5 m/s^2")),
            new ConstantData(mjs.parse("v[i]"), mjs.unit("7 m/s")),
        ],
        equations: [
            new EquationData([
              texmp.parseTex("\\Sigma F = m a"),
              texmp.parseTex("\\frac{\\Sigma F}{m} = a"),
            ]),
            new EquationData([
              texmp.parseTex("\\Delta v = a \\ t")
            ]),
            new EquationData([
              texmp.parseTex("a^2 + b^2 = c^2")
            ]),
        ]
      }
    ],
    activeProblemId: null
  }
  data.activeProblemId = data.problems[0].id
  return data
}
