
export default function modifyRules(mjs) {
  mjs.simplify.rules.splice(
    mjs.simplify.rules.indexOf(rule =>
      rule.s == "n*(n1/n2) -> (n*n1)/n2" ||
      rule.l == "n*(n1/n2)" && rule.r == "(n*n1)/n2"
    ),
    1,
    {l: "cd * (cd1 / cd2)", r: "(cd * cd1) / cd2", assuming: {multiply: {associative: true}}},
    {l: "n * (n1 / vd2)", r: "(n * n1) / vd2", assuming: {multiply: {associative: true}}},
    {l: "n * (vd1 / n2)", r: "(n * vd1) / n2", assuming: {multiply: {associative: true}}}
  )
}
