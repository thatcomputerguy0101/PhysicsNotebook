import html from "./display/html.js"
import mjs from "./mathjs/index.js"
import { App } from "./display/app.js"
import "./manipulations/selection.js"

console.log("Main has run")

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(html`<${App}/>`)
