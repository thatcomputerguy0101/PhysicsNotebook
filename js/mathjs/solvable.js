export const solvables = [
  "vl",
  "changeIn(vl)",
  "net(vl)",
  "sin(vl)",
  "cos(vl)",
  "vl[n]",
]

export default function expandSolvable(rule) {
  return solvables.map(solvable => rule.replace(/vl/, solvable))
}
