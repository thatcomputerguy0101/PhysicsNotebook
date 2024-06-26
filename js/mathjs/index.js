import changeIn from "./changeIn.js"
import net from "./net.js"
import modifyRules from "./simplifyRules.js"
import modifyUnits from "./units.js"
import fixTex from "./fixTex.js"
import expandSolvable from "./solvable.js"

export const mjs = math.create()
export default mjs

const imports = {
  changeIn,
  net,
  expandSolvable
}

mjs.import(imports)
texmp.import(imports)

mjs.fixTex = fixTex

modifyRules(mjs)

modifyUnits(mjs)
