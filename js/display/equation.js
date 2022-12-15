import html from "./html.js"

export class Equation extends React.Component {
  static defaultProps = {
    editable: false,
    onEnter: undefined,
    onEdit: undefined,
    onSelectionChange: undefined,
    onMoveOutOf: undefined,
    onSelectOutOf: undefined,
    onUpOutOf: undefined,
    onDownOutOf: undefined,
    innerFieldHandlers: []
  }

  constructor(...args) {
    super(...args)
    this.handleSelection = this.handleSelection.bind(this)
    this.mqRef = React.createRef()
  }

  loadMathField() {
    if (!this.props.editable) {
      this.math = MQ.StaticMath(this.mqRef.current)
      for (let i = 0; i < this.math.innerFields.length; i++) {
        const field = this.math.innerFields[i]
        if (this.props.innerFieldHandlers[i] != undefined) {
          field.setHandlers(this.constructor.wrapHandlers(this.props.innerFieldHandlers[i], field))
        } else {
          field.setHandlers(this.constructor.wrapHandlers(this.props, field))
        }
        field.parent = this.math
      }
    } else {
      this.math = MQ.MathField(this.mqRef.current, {
        handlers: this.constructor.wrapHandlers(this.props, this.math)
      })
    }
  }

  unloadMathField() {
    this.math.revert()
  }

  componentDidMount() {
    // TODO: Move this event listener to MathQuill patch
    document.addEventListener("selectionchange", this.handleSelection)
    // When added to the visible structure
    this.loadMathField()
  }

  getSnapshotBeforeUpdate(prevProps) {
    if (prevProps.children != this.props.children) {
      // Unload math field for the next one to be loaded correctly
      this.unloadMathField()
    }
    return null
  }

  componentDidUpdate(prevProps) {
    if (prevProps.children != this.props.children) {
      // Reaload math field so that it doesnt break
      this.loadMathField()
    }
  }

  componentWillUnmount() {
    document.removeEventListener("selectionchange", this.handleSelection)
    this.unloadMathField()
  }

  static wrapHandlers(handlers, field) {
    return {
      enter: handlers.onEnter ? event => handlers.onEnter({...event, target: field}) : undefined,
      edit: handlers.onEdit ? event => handlers.onEdit({...event, target: field}) : undefined,
      moveOutOf: handlers.onMoveOutOf ? event => handlers.onMoveOutOf({...event, target: field}) : undefined,
      selectOutOf: handlers.onSelectOutOf ? event => handlers.onSelectOutOf({...event, target: field}) : undefined,
      upOutOf: handlers.onUpOutOf ? event => handlers.onUpOutOf({...event, target: field}) : undefined,
      downOutOf: handlers.onDownOutOf ? event => handlers.onDownOutOf({...event, target: field}) : undefined
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
    return html`<span className=${this.props.className} onClick=${this.props.onClick} ref=${this.mqRef}>${this.props.children}</span>`
  }
}
