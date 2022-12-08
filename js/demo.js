import mjs from "./mathjs/index.js"

export default function demoWorkbook() {
  // This is essentially a database stub while the app is still the primary development focus
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
            name: new mjs.SymbolNode("d"),
            value: mjs.unit("7 m"),
          },
        ],
        equations: [
          {
            id: crypto.randomUUID(),
            states: [
              texmp.parseTex("\\Sigma F = m a"),
              texmp.parseTex("\\frac{\\Sigma F}{m} = a")
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
