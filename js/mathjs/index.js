import changeIn from "./changeIn.js"
import net from "./net.js"

export const mjs = math.create()
export default mjs


// TODO: Promote changeIn and net to operators (instead of functions) for better parentheses handling
mjs.import({
  changeIn,
  net
})
