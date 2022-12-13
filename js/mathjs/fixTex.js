export default function fixTex(tex) {
  return tex.replace(/([^\\])~/g, "$1")
            .replaceAll("$~", "")
}
