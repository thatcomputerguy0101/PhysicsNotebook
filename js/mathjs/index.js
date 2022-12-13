import changeIn from "./changeIn.js"
import net from "./net.js"
import modifyRules from "./simplifyRules.js"
import fixTex from "./fixTex.js"

export const mjs = math.create()
export default mjs

const imports = {
  changeIn,
  net,
}

mjs.import(imports)
texmp.import(imports)

mjs.fixTex = fixTex

modifyRules(mjs)
