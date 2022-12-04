export default function changeIn(args, math, scope) {
  math.subtract(
    new math.AccessorNode(args[0], new math.IndexNode(new math.SymbolNode("f"))).evaluate(scope),
    new math.AccessorNode(args[0], new math.IndexNode(new math.SymbolNode("i"))).evaluate(scope)
  )
}

changeIn.rawArgs = true
changeIn.toTex = {1: "\\Delta ${args[0]}"}
