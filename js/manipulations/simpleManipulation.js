var mjs = require("mathjs")

var rules = [
  [Function: simplifyCore] {
    signatures: {
      Node: [Function: _simplifyCore],
      'Node,Object': [Function: _simplifyCore]
    },
    _typedFunctionData: { signatures: [Array], signatureMap: [Map] }
  },
  { l: 'log(e)', r: '1' },
  { s: 'n-n1 -> n+-n1', assuming: { subtract: [Object] } },
  { s: 'n-n -> 0', assuming: { subtract: [Object] } },
  {
    s: '-(c*v) -> v * (-c)',
    assuming: { multiply: [Object], subtract: [Object] }
  },
  {
    s: '-(c*v) -> (-c) * v',
    assuming: { multiply: [Object], subtract: [Object] }
  },
  {
    s: '-(v*c) -> v * (-c)',
    assuming: { multiply: [Object], subtract: [Object] }
  },
  { l: '-(n1/n2)', r: '-n1/n2' },
  { l: '-v', r: 'v * (-1)' },
  { l: '(n1 + n2)*(-1)', r: 'n1*(-1) + n2*(-1)', repeat: true },
  { l: 'n/n1^n2', r: 'n*n1^-n2' },
  { l: 'n/n1', r: 'n*n1^-1' },
  {
    s: '(n1*n2)^n3 -> n1^n3 * n2^n3',
    assuming: { multiply: [Object] }
  },
  {
    s: '(n1*n2)^(-1) -> n2^(-1) * n1^(-1)',
    assuming: { multiply: [Object] }
  },
  {
    s: '(n ^ n1) ^ n2 -> n ^ (n1 * n2)',
    assuming: { divide: [Object] }
  },
  { l: ' v   * ( v   * n1 + n2)', r: 'v^2       * n1 +  v   * n2' },
  {
    s: ' v   * (v^n4 * n1 + n2)   ->  v^(1+n4)  * n1 +  v   * n2',
    assuming: { divide: [Object] }
  },
  {
    s: 'v^n3 * ( v   * n1 + n2)   ->  v^(n3+1)  * n1 + v^n3 * n2',
    assuming: { divide: [Object] }
  },
  {
    s: 'v^n3 * (v^n4 * n1 + n2)   ->  v^(n3+n4) * n1 + v^n3 * n2',
    assuming: { divide: [Object] }
  },
  { l: 'n*n', r: 'n^2' },
  { s: 'n * n^n1 -> n^(n1+1)', assuming: { divide: [Object] } },
  { s: 'n^n1 * n^n2 -> n^(n1+n2)', assuming: { divide: [Object] } },
  [Function: simplifyConstant] {
    signatures: { Node: [Function: Node], 'Node,Object': [Function: NodeObject] },
    _typedFunctionData: { signatures: [Array], signatureMap: [Map] }
  },
  { s: 'n+n -> 2*n', assuming: { add: [Object] } },
  { l: 'n+-n', r: '0' },
  { l: 'v*n + v', r: 'v*(n+1)' },
  { l: 'n3*n1 + n3*n2', r: 'n3*(n1+n2)' },
  { l: 'n3^(-n4)*n1 +   n3  * n2', r: 'n3^(-n4)*(n1 + n3^(n4+1) *n2)' },
  { l: 'n3^(-n4)*n1 + n3^n5 * n2', r: 'n3^(-n4)*(n1 + n3^(n4+n5)*n2)' },
  { s: 'n*v + v -> (n+1)*v', assuming: { multiply: [Object] } },
  {
    s: 'n1*n3 + n2*n3 -> (n1+n2)*n3',
    assuming: { multiply: [Object] }
  },
  {
    s: 'n1*n3^(-n4) + n2 * n3    -> (n1 + n2*n3^(n4 +  1))*n3^(-n4)',
    assuming: { multiply: [Object] }
  },
  {
    s: 'n1*n3^(-n4) + n2 * n3^n5 -> (n1 + n2*n3^(n4 + n5))*n3^(-n4)',
    assuming: { multiply: [Object] }
  },
  { l: 'n*c + c', r: '(n+1)*c' },
  { s: 'c*n + c -> c*(n+1)', assuming: { multiply: [Object] } },
  [Function: simplifyConstant] {
    signatures: { Node: [Function: Node], 'Node,Object': [Function: NodeObject] },
    _typedFunctionData: { signatures: [Array], signatureMap: [Map] }
  },
  { s: '(-n)*n1 -> -(n*n1)', assuming: { subtract: [Object] } },
  {
    s: 'n1*(-n) -> -(n1*n)',
    assuming: { subtract: [Object], multiply: [Object] }
  },
  {
    s: 'c+v -> v+c',
    assuming: { add: [Object] },
    imposeContext: { add: [Object] }
  },
  {
    s: 'v*c -> c*v',
    assuming: { multiply: [Object] },
    imposeContext: { multiply: [Object] }
  },
  { l: 'n+-n1', r: 'n-n1' },
  { s: 'n*(n1^-1) -> n/n1', assuming: { multiply: [Object] } },
  { s: 'n*n1^-n2 -> n/n1^n2', assuming: { multiply: [Object] } },
  { s: 'n^-1 -> 1/n', assuming: { multiply: [Object] } },
  { l: 'n^1', r: 'n' },
  { s: 'n*(n1/n2) -> (n*n1)/n2', assuming: { multiply: [Object] } },
  /* replace one above with 3 below
  {l: "cd * (cd1 / cd2)", r: "(cd * cd1) / cd2"},
  {l: "n * (n1 / vd2)", r: "(n * n1) / vd2"},
  {l: "n * (vd1 / n2)", r: "(n * vd1) / n2"}
  */
  { s: 'n-(n1+n2) -> n-n1-n2', assuming: { addition: [Object] } },
  { l: '1*n', r: 'n', imposeContext: { multiply: [Object] } },
  { s: 'n1/(n2/n3) -> (n1*n3)/n2', assuming: { multiply: [Object] } },
  { l: 'n1/(-n2)', r: '-n1/n2' }
]


export class SimpleManipulation extends Manipulation{
  public var result;
  constructor(){};
  constructor(pattern, symbol) {
      this.pattern = pattern;
      this.symbol = symbol
  }

  public function substitute(EquationState state){
    result = mjs.simplify(state, rules);
    return result
  }

}
