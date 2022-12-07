import mjs from "./mathjs/index.js"

export default function demoWorkbook() {
  return {
    id: crypto.randomUUID(),
    name: "TestWorkbook",
    problems: [
      {
        id: crypto.randomUUID(),
        name: "TestProblem",
        active: true,
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
    ]
  }
}
