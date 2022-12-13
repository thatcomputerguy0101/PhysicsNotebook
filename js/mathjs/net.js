export default function net(args, math, scope) {
  return scope.args.map(arg => {
    for (node of scope.keys()) {
      if (node.isAccessorNode && args.includes(node.object) || args.includes(node)) {
        return scope.get(node)
      }
    }
  }).reduce((tot, acc) => math.add(tot, acc))
}

net.rawArgs = true
net.toTex = {1: (node, options) => {
  // This is modified from the mathjs OperatorNode toTex
  const parenthesis = (options && options.parenthesis) ? options.parenthesis : 'keep'
  const implicit = (options && options.implicit) ? options.implicit : 'hide'
  const args = node.args
  const parens = false //calculateNecessaryParentheses(this, parenthesis, implicit, args, true)
  /* TODO: Actually calcualte the necessary parens based on the arguments.
           There arent any cases in the existing equation packs where this is
           necessary, but no parens may cause bugs with user-inputted equations */

  let op = "\\Sigma"

  // unary operator

  let operand = args[0].toTex(options)
  if (parens[0]) {
    operand = `\\left(${operand}\\right)`
  }

  // prefix operator
  return op + operand
}}
