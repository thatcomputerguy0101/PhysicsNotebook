
export default function modifyRules(mjs) {
  const startIndex = mjs.simplify.rules.findIndex(rule =>
    rule.s == "n*(n1/n2) -> (n*n1)/n2" ||
    rule.l == "n*(n1/n2)" && rule.r == "(n*n1)/n2"
  )

  const rootIndex = mjs.simplify.rules.findIndex(rule =>
    rule.l == "n+-n" && rule.r == "0"
  )

  if (startIndex == -1) {
    // Rule not found
    throw new Error("MathJS changed its simplify rules, and the fraction rule was unable to be located")
  }

  mjs.simplify.rules.splice(
    startIndex,
    1, // Remove one rule, replace with the following three
    {l: "cd * (cd1 / cd2)", r: "(cd * cd1) / cd2", assuming: {multiply: {associative: true}}},
    {l: "n * (n1 / vd2)", r: "(n * n1) / vd2", assuming: {multiply: {associative: true}}},
    {l: "n * (vd1 / n2)", r: "(n * vd1) / n2", assuming: {multiply: {associative: true}}}
  )

  mjs.simplify.rules.splice(
    rootIndex,
    0, // Add rules
    {l: "sqrt(n1)^2", r: "n1"},
    {l: "sqrt(n1^2)", r: "n1"},
    //{l: "pow(nthRoot(n1,n2),n2)", r: "n1"}, doesnt work needs looked at
  )


}
