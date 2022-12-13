const one = new math.ConstantNode(1)
const inv = new math.SymbolNode("inv")
const {AccessorNode, IndexNode, SymbolNode} = math

export default function changeIn(args, math, scope) {
  if (args[0].isSymbolNode || args[0].isAccessorNode) {
    math.subtract(
      new AccessorNode(args[0], new IndexNode([new SymbolNode("f")])).evaluate(scope),
      new AccessorNode(args[0], new IndexNode([new SymbolNode("i")])).evaluate(scope)
    )
  } else if (
    args[0].isOperatorNode && args[0].fn == 'divide' && args[0].args[0].equals(one) &&
    (args[0].args[1].isSymbolNode || args[0].args[1].isAccessorNode)
  ) {
    math.subtract(
      math.inv(new AccessorNode(args[0].args[1], new IndexNode([new SymbolNode("f")])).evaluate(scope)),
      math.inv(new AccessorNode(args[0].args[1], new IndexNode([new SymbolNode("i")])).evaluate(scope))
    )
  } else if (
    args[0].isFunctionNode && args[0].fn == inv &&
    (args[0].args[0].isSymbolNode || args[0].args[0].isAccessorNode)
  ) {
    math.subtract(
      math.inv(new AccessorNode(args[0].args[0], new IndexNode([new SymbolNode("f")])).evaluate(scope)),
      math.inv(new AccessorNode(args[0].args[0], new IndexNode([new SymbolNode("i")])).evaluate(scope))
    )
  } else {
    throw new Error(`changeIn is not defined for ${args[0].toString()}`)
  }
}

changeIn.rawArgs = true
changeIn.toTex = {1: (node, options) => {
  // This is modified from the mathjs OperatorNode toTex
  const parenthesis = (options && options.parenthesis) ? options.parenthesis : 'keep'
  const implicit = (options && options.implicit) ? options.implicit : 'hide'
  const args = node.args
  const parens = false //calculateNecessaryParentheses(this, parenthesis, implicit, args, true)
  /* TODO: Actually calcualte the necessary parens based on the arguments.
           There arent any cases in the existing equation packs where this is
           necessary, but no parens may cause bugs with user-inputted equations */

  let op = "\\Delta"

  // unary operator

  let operand = args[0].toTex(options)
  if (parens[0]) {
    operand = `\\left(${operand}\\right)`
  }

  // prefix operator
  return op + operand
}}
