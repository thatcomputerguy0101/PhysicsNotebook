import mjs from "../mathjs/index.js"

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
          {
            id: crypto.randomUUID(),
            name: new mjs.SymbolNode("a"),
            value: mjs.unit("5 m/s^2"),
          },
          {
            id: crypto.randomUUID(),
            name: mjs.parse("v[i]"),
            value: mjs.unit("7 m/s"),
          },
        ],
        equations: [
          {
            id: crypto.randomUUID(),
            states: [
              texmp.parseTex("\\Sigma F = m a"),
              texmp.parseTex("\\frac{\\Sigma F}{m} = a")
            ]
          },
          {
            id: crypto.randomUUID(),
            states: [
              texmp.parseTex("\\Delta v = a \\ t")
            ]
          },
          {
            id: crypto.randomUUID(),
            states: [
              texmp.parseTex("a^2 + b^2 = c^2")
            ]
          }
        ]
      }
    ],
    activeProblemId: null
  }
  data.activeProblemId = data.problems[0].id
  return data
}
