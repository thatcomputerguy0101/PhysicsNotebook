// This file monkey patches a Selection API to the MathQuill library

class Selection {
  constructor(selection) {
    // Parse latex into start, end, contents
    this.start = selection.indexOf("\\MathQuillSelectionStart")
    this.end = selection.indexOf("\\MathQuillSelectionEnd") - "\\MathQuillSelectionStart".length
    this.selection = selection.match(/\\MathQuillSelectionStart(.*)\\MathQuillSelectionEnd/)[1]
    this.latex = selection.replace(/\\MathQuillSelectionStart|\\MathQuillSelectionEnd/g, "")
    this.raw = selection.replace(/\\MathQuillSelectionStart(.*)\\MathQuillSelectionEnd/g, "\\MathQuillSelection{$1}")
    this.rawFunction = selection.replace(/\\MathQuillSelectionStart(.*)\\MathQuillSelectionEnd/g, "\\operatorname{MathQuillSelection}\\left($1\\right)")
  }

  static #yetToInit = true

  static registerMethods(mathfield) {
    if (this.#yetToInit) {
      // Add latex method to selection so that it can be temporarily inserted into the MQ tree
      let Selection = mathfield.__controller.cursor.selection?.constructor
      if (Selection == undefined) {
        mathfield.select()
        Selection = mathfield.__controller.cursor.selection.constructor
        mathfield.clearSelection()
      }
      Selection.prototype.latex = function() { return this.join('latex') }

      let NodeProto = Object.getPrototypeOf(mathfield.__controller.root)
      while (!NodeProto.hasOwnProperty(MQ.L)) {
        NodeProto = Object.getPrototypeOf(NodeProto)
        if (NodeProto == Object.prototype) {
          throw new Error("Interal type structure of MathQuill changed, this patch will no longer work")
        }
      }
      let Node = NodeProto.constructor

      // Technically, this should extend MathCommand, but that is harder to access
      SelectionNode = class SelectionNode extends Node {
        constructor(selection) {
          {
            super()
            this.__proto__ = SelectionNode.prototype // Required since P.js does weird stuff to its classes
          }
          this.selection = selection
          this.ends = {[MQ.L]: selection, [MQ.R]: selection}
          this[MQ.L] = selection.ends[MQ.L][MQ.L]
          this[MQ.R] = selection.ends[MQ.R][MQ.R]
          if (selection.ends[MQ.L].parent != selection.ends[MQ.R].parent) {
            throw new Error("Selection ends do not have the same parent")
          }
          this.parent = selection.ends[MQ.L].parent
        }

        latex() {
          return "\\MathQuillSelectionStart" + this.ends[MQ.L].latex() + "\\MathQuillSelectionEnd"
        }
      }
    }

    let APIClasses
    if (mathfield.__controller.options.handlers == undefined) {
      MQ.config({handlers: {}})
      APIClasses = mathfield.__controller.options.handlers.APIClasses
      delete Object.getPrototypeOf(mathfield.__controller.options).handlers
    } else {
      APIClasses = mathfield.__controller.options.handlers.APIClasses
    }

    APIClasses.AbstractMathQuill.prototype.getSelection = getSelection

    APIClasses.MathField.prototype.setHandlers = function setHandlers(handlers) {
      this.__controller.options.handlers = {fns: handlers, APIClasses}
    }

    this.#yetToInit = false
  }

  static getSelection(mathfield) {
    // Currently uses MQ internal APIs since MQ only exposes selection text through the DOM
    // TODO: Upstream this functionality to the MathQuill library to mitigate it getting broken

    if (mathfield == null) {
      return null
    }

    // Set up additional type structure
    if (this.#yetToInit) {
      this.registerMethods(mathfield)
    }

    return mathfield.getSelection()
  }
}

function getSelection() {
  let selection = this.__controller.cursor.selection

  if (selection == null) {
    return null
  }

  // Create selection node to insert into MQ's state tree
  let selectionNode = new SelectionNode(selection)

  // Insert selection node around selected contents
  if (selectionNode[MQ.L] == 0) {
    // Update parent (always works since blocks are used for branching parents)
    selectionNode.selection.ends[MQ.L].parent.ends[MQ.L] = selectionNode
  } else {
    // Update sibling
    selectionNode[MQ.L][MQ.R] = selectionNode
  }

  if (selectionNode[MQ.R] == 0) {
    // Update parent (always works since blocks are used for branching parents)
    selectionNode.selection.ends[MQ.R].parent.ends[MQ.R] = selectionNode
  } else {
    // Update sibling
    selectionNode[MQ.R][MQ.L] = selectionNode
  }

  try {
    // Latex whole tree
    var latex = this.latex()
  } finally {
    // Remove selection node around selected contents
    if (selectionNode[MQ.L] == 0) {
      selectionNode.selection.ends[MQ.L].parent.ends[MQ.L] = selection.ends[MQ.L]
    } else {
      selectionNode[MQ.L][MQ.R] = selection.ends[MQ.L]
    }

    if (selectionNode[MQ.R] == 0) {
      selectionNode.selection.ends[MQ.R].parent.ends[MQ.R] = selection.ends[MQ.R]
    } else {
      selectionNode[MQ.R][MQ.L] = selection.ends[MQ.R]
    }
  }

  // Return selection object with start, end, selection, and raw
  return new Selection(latex)
}

let SelectionNode

export var registerMethods = Selection.registerMethods.bind(Selection)

if (globalThis.MQ != undefined) {
  let span = document.createElement("span")
  span.innerText = "a"
  let math = MQ.MathField(span)
  Selection.registerMethods(math)
}
