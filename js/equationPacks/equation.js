import html from "../html.js"

export class Equation extends React.Component {
  static defaultProps = {
    editable: false,
    onEnter: undefined,
    onEdit: undefined,
    onSelectionChange: undefined,
    onMoveOutOf: undefined,
    onSelectOutOf: undefined,
    onUpOutOf: undefined,
    onDownOutOf: undefined
  }

  constructor(...args) {
    super(...args)
    this.mqRef = React.createRef()
    this.handleSelection = this.handleSelection.bind(this)
  }

  componentDidMount() {
    document.addEventListener("selectionchange", this.handleSelection)
    // When added to the visible structure
    if (!this.props.editable) {
      this.math = MQ.StaticMath(this.mqRef.current)
      // this.registerStaticHandlers()
      if (this.math.innerFields.length > 0) {
        // for field in fields this.registerDynamicHandlers()
      }
    } else {
      this.math = MQ.MathField(this.mqRef.current, {
        handlers: {
          enter: this.props.onEnter,
          edit: this.props.onEdit,
          moveOutOf: this.props.onMoveOutOf,
          selectOutOf: this.props.onSelectOutOf,
          upOutOf: this.props.onUpOutOf,
          downOutOf: this.props.onDownOutOf
        }
      })
    }
  }

  componentWillUnmount() {
    document.removeEventListener("selectionchange", this.handleSelection)
  }

  handleSelection(event) {
    if (this.mqRef.current.contains(document.getSelection().focusNode) && typeof this.props.onSelectionChange == "function") {
      this.props.onSelectionChange(this.math.getSelection())
    }
  }

  render() {
    return html`<span className=${this.props.className} ref=${this.mqRef}>${this.props.children}</span>`
  }
}
