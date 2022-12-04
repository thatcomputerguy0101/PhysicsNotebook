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
net.toTex = {1: "\\Sigma ${args[0]}"}
