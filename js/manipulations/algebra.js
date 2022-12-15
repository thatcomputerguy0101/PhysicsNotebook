import { SimpleManipulation } from "./simpleManipulation.js"
import { SubsitutionManipulation } from "./subsitutionManipulation.js"

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

  //for testing
  // new SimpleManipulation([
  //   {l: "MathQuillSelection(n1) == n2", r: "a == log(b,c)"},
  // ], "test"),

  new SimpleManipulation([
    {l: "n1 == MathQuillSelection(sqrt(n2))", r: "(n1)^2 == n3"},
    {l: "n1 == sqrt(MathQuillSelection(n2))", r: "(n1)^2 == n2"},
    {l: "MathQuillSelection(sqrt(n1)) == n2", r: "n1 == (n2)^2"},
    {l: "sqrt(MathQuillSelection(n1)) == n2", r: "n1 == (n2)^2"},

    //change parser
    {l: "n1 == nthRoot(MathQuillSelection(n2),n3)", r: "n1 == n2^n3"},
    {l: "n1 == MathQuillSelection(nthRoot(n2,n3))", r: "n1 == n2^n3"},
    {l: "nthRoot(MathQuillSelection(n2),n3) == n1", r: "n2^n3 == n1"},
    {l: "MathQuillSelection(nthRoot(n2,n3)) == n1", r: "n2^n3 == n1"},

    //cant test might need to change parser
    {l:"n1 == log(MathQuillSelection(n2),n3)", r:"n3^n1 == n2" },
    {l:"n1 == MathQuillSelection(log(n2,n3))", r:"n3^n1 == n2" },
    {l:"log(MathQuillSelection(n2),n3) == n1", r:"n2 == n3^n1" },
    {l:"MathQuillSelection(log(n2,n3)) == n1", r:"n2 == n3^n1" },
  ], "x^2"),

  new SimpleManipulation([
    {l: "n1 == MathQuillSelection(n2^2)", r: "sqrt(n1) == n2"},
    {l: "n1 == (MathQuillSelection(n2))^2", r: "sqrt(n1) == n2"},
    {l: "MathQuillSelection(n1^2) == n2", r: "n1 == sqrt(n2)"},
    {l: "(MathQuillSelection(n1))^2 == n2", r: " n1 == sqrt(n2)"},
  ], "\\sqrt(x)"),

  //cube root might not want
  new SimpleManipulation([
    {l: "n1 == MathQuillSelection(n2^3)", r: "cbrt(n1) == n2"},
    {l: "n1 == (MathQuillSelection(n2))^3", r: "cbrt(n1) == n2"},
    {l: "MathQuillSelection(n1^3) == n2", r: "n1 == cbrt(n2)"},
    {l: "(MathQuillSelection(n1))^3 == n2", r: " n1 == cbrt(n2)"},
  ], "\\sqrt[3]{x}"),

  new SimpleManipulation([
    {l: "n1 == MathQuillSelection(n2^n3)", r: "nthRoot(n1,n3) == n2"},
    {l: "n1 == n2^MathQuillSelection(n3)", r: "nthRoot(n1,n3) == n2"},
    {l: "MathQuillSelection(n2^n3) == n1", r: "n2 == nthRoot(n1,n3)"},
    {l: "n2^MathQuillSelection(n3) == n1", r: "n2 == nthRoot(n1,n3)"},
  ], "\\sqrt[x]{y}"),

  new SimpleManipulation([
    {l: "n1 == MathQuillSelection(n2^n3)", r: "log(n1,n2) == n3"},
    {l: "n1 == MathQuillSelection(n2)^n3", r: "log(n1,n2) == n3"},
    {l: "MathQuillSelection(n1^n2) == n3", r: "n2 == log(n3,n1)"},
    {l: "MathQuillSelection(n1)^n2 == n3", r: "n2 == log(n3,n1)"},
  ], "\\log(x)"),

  new SimpleManipulation([
    {l: "n1 == MathQuillSelection(e^n2)", r: "ln(n1) == n2"},
    {l: "n1 == MathQuillSelection(e)^n2", r: "ln(n1) == n2"},
    {l: "MathQuillSelection(e^n1) == n2", r: "n1 == ln(n2)"},
    {l: "MathQuillSelection(e)^n1 == n2", r: "n1 == ln(n2)"},
  ], "\\ln(x)"),

  new SubsitutionManipulation([
    // These don't work with the syntax tree
    // "vl MathQuillSelection(==) n",
    // "n MathQuillSelection(==) vl",
    "MathQuillSelection(vl == n)",
    "MathQuillSelection(n == vl)",
  ], "solve", "x=5"),

  new SubsitutionManipulation([
    "MathQuillSelection(vl)",
  ], "subsitute", "x=2y"),
]
