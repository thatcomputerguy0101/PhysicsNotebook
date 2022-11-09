import html from "../html.js"
import physics from "./packs/physics.js"

class EquationPack {
  #categories

  constructor(categories) {
    this.#categories = categories
  }

  static fromObject(json) {
    if (typeof json != "object") {
      throw new TypeError("Provided object is not an object")
    }
    let parsedJson = {}
    for (category of Object.keys(json)) {
      parsedJson[category] = Category.fromObject(category, json[category])
    }
    return new EquationPack(paresdJson)
  }

  static physics = EquationPack.fromObject()
}

class Category {
  #name
  #equaitons

  constructor(name, equations) {
    this.#name = name
    this.#equations = equations
  }

  static fromObject(name, json) {
    if (!Array.isArray(json)) {
      throw new TypeError(`Provided object for ${category} is not an array`)
    }
    return new Category(json.map(equation => html``))
  }
}
