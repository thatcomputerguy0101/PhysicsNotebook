import mjs from "../mathjs/index.js"
import { WorkbookData } from "./workbookData.js"
import { ProblemData } from "./problemData.js"
import { EquationData } from "./equationData.js"
import { ConstantData } from "./constantData.js"

export default function demoWorkbook() {
  // This is essentially a database stub while the app's features is still the primary development focus
  return new WorkbookData("TestWorkbook", [
    new ProblemData("TestProblem", [
      new ConstantData(new mjs.SymbolNode("a"), mjs.unit("5 m/s^2")),
      new ConstantData(mjs.parse("v[i]"), mjs.unit("7 m/s")),
    ], [
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
    ])
  ])
}
