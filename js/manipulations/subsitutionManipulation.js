import mjs from "../mathjs/index.js"
import { Manipulation } from "./manipulation.js"

const findSel = node => {
  if (node.isFunctionNode && node.name == "MathQuillSelection") {
    return node
  } else {
    return node.map(findSel).filter(res => res)[0]
  }
}

export class SubsitutionManipulation extends Manipulation {
  constructor(patterns, mode, symbol) {
    super()
    this.replacements = patterns.map(pattern => ({l: pattern, r: mode + "()"}))
    this.mode = mode
    this.symbol = symbol
  }

  test(selection, scope) {
    if (super.test(selection)) {
      switch (this.mode) {
        case "subsitute":
          const selNode = selection.filter(node => node.isFunctionNode && node.name == "MathQuillSelection")[0]
          // Prevent self-subsitution
          if (selection.args[0].equals(selNode)) {
            scope = scope.filter(constant => !constant.valueNode.equals(selection.args[1]))
          } else if (selection.args[1].equals(selNode)) {
            scope = scope.filter(constant => !constant.valueNode.equals(selection.args[0]))
          }
          return scope.find(constant => selNode.args[0].equals(constant.name) && !constant.valueNode.isConstantNode) != undefined
        case "solve":
          const orderedSel = mjs.simplify(selection, mjs.expandSolvable("n == vl").map(pattern => ({l: pattern, r: pattern.split(" == ").reverse().join(" == ")})).concat({l: "MathQuillSelection(n)", r: "n"}))
          const unsolved = orderedSel.args[1]
          return unsolved.transform(node => scope.find(constant => node.equals(constant.name) && constant.valueNode.isConstantNode)?.valueNode ?? node).filter(node => node.isSymbolNode).length == 0
        default:
          throw new Error("Invalid subsitution mode")
      }
    } else {
      return false
    }
  }

  substitute(selection, scope) {
    switch (this.mode) {
      case "subsitute":
        return mjs.simplify(selection.transform(node => {
          // Prevent self-subsitution
          if (selection.args[0].isFunctionNode && selection.args[0].name == "MathQuillSelection") {
            scope = scope.filter(constant => !constant.valueNode.equals(selection.args[1]))
          } else if (selection.args[1].isFunctionNode && selection.args[1].name == "MathQuillSelection") {
            scope = scope.filter(constant => !constant.valueNode.equals(selection.args[0]))
          }
          if (node.isFunctionNode && node.name == "MathQuillSelection") {
            // Second comparison tries to prevent subsituting a variable with itself
            return scope.find(constant => node.args[0].equals(constant.name) && node.args[0] !== constant.name && !constant.valueNode.isConstantNode).valueNode
          } else {
            return node
          }
        }))
      case "solve":
        // Ensure that variable is first
        const orderedSel = mjs.simplify(selection, mjs.expandSolvable("n == vl").map(pattern => ({l: pattern, r: pattern.split(" == ").reverse().join(" == ")})).concat({l: "MathQuillSelection(n)", r: "n"}))
        return orderedSel.map((node, i) => i == 1 ? node.transform(node => scope.find(constant => node.equals(constant.name) && constant.valueNode.isConstantNode)?.valueNode ?? node) : node)
      default:
        throw new Error("Invalid subsitution mode")
    }
  }
}
