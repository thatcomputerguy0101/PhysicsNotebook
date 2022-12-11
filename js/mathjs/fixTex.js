export default function fixTex(tex) {
  return tex.replace(/([^\\])~/g, "$1")
            .replaceAll("$~", "")
            .replace(/\\Sigma\s*\\cdot/g, "\\Sigma")
            .replaceAll(/\\Delta\s*\\cdot/g, "\\Delta")
}
