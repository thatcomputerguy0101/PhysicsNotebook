import { SimpleManipulation } from "./simpleManipulation.js"

export default [
  new SimpleManipulation([
    {l: "n1 == n2 - MathQuillSelection(n3)", r: "n1 + n3 == n2"},
    {l: "n1 - MathQuillSelection(n2) == n3", r: "n1 == n3 + n2"},
    {l: "n1 == MathQuillSelection(n2) - n3", r: "n1 + n3 == n2"},
    {l: "MathQuillSelection(-n1) == n2",     r: "0 == n1 + n2"},
    {l: "n1 == MathQuillSelection(-n2) ",    r: "n1 + n2 == 0"},
    {l: "-MathQuillSelection(n1) == n2",     r: "0 == n1 + n2"},
    {l: "n1 == -MathQuillSelection(n2) ",    r: "n1 + n2 == 0"},
    {l: "MathQuillSelection(n1) - n2 == n3 ",r: "n1 == n3 + n2"},

  ], "+"),

  new SimpleManipulation([
    {l: "n1 == n2 + MathQuillSelection(n3)", r: "n1 - n3 == n2"},
    {l: "n1 + MathQuillSelection(n2) == n3", r: "n1 == n3 - n2"},
    {l: "n1 == MathQuillSelection(n2)",      r: "n1 - n2 == 0"},
    {l: "MathQuillSelection(n1) == n2",      r: "0 == n2 - n1"},
  ], "-"),

  new SimpleManipulation([
    {l: "MathQuillSelection(n1) / n2 == n3", r: "n1 == n2 n3"},
    {l: "n1 / MathQuillSelection(n2) == n3", r: "n1 == n2 n3"},
    {l: "n1 == n2 / MathQuillSelection(n3)", r: "n1 n3 == n2"},
    {l: "n1 == MathQuillSelection(n2) / n3", r: "n1 n3 == n2"},
  ], "*"),
  //division doesnt read
  new SimpleManipulation([
    {l: "n1 == n2 * MathQuillSelection(n3)", r: "n1 / n3 == n2"},
    {l: "n1 * MathQuillSelection(n2) == n3", r: "n1 == n3 / n2"},
  ], "/"),

  new SimpleManipulation([
    {l: "MathQuillSelection(changeIn(vl))", r: "vl[f] - vl[i]"},
    {l: "MathQuillSelection(changeIn(1 / vl))", r: "1 / vl[f] - 1 / vl[i]"},
  ], "\\Delta"),
]