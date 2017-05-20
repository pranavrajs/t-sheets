import React from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'

import Keyboard from './keyboard'
import './HomeView.scss'

class Col extends React.PureComponent {
  static propTypes = {
    row: PropTypes.number,
    col: PropTypes.number,
    data: PropTypes.object,
    editCol: PropTypes.func,
    clearEdit: PropTypes.func,
  }
  onKeyDown (e) {
    console.log(e);
  }
  onClick () {
    console.log('onClick', this.props.row, this.props.col)
  }
  onDoubleClick () {
    const { row, col, editCol } = this.props
    editCol({
      attr: {
        contentEditable: true,
      },
      x: row,
      y: col,
    })
  }
  selectCol () {
    const { row, col, editCol, clearEdit, data } = this.props
    if (data.isSelected) {
      return
    }
    clearEdit({
      x: row,
      y: col,
    })
    editCol({
      attr: {
        isSelected: true,
      },
      x: row,
      y: col,
    })
  }

  computeClasses () {
    const { data } = this.props
    let className = 'col'
    if (data.isSelected) {
      className = `${className} selected`
    }
    if (data.bold) {
      className = `${className} bold`
    }
    if (data.italics) {
      className = `${className} italics`
    }
    if (data.underline) {
      className = `${className} underline`
    }
    return className
  }

  emitChange () {
    const { row, col, editCol, data } = this.props
    const value = ReactDOM.findDOMNode(this).innerHTML
    if (data.value === value) {
      return
    }
    editCol({
      attr: {
        value,
      },
      x: row,
      y: col,
    })
  }

  render () {
    const { value, contentEditable } = this.props.data
    return (
      <div
        className={this.computeClasses()}
        contentEditable={contentEditable}
        // onInput={() => this.emitChange()}
        onBlur={() => this.emitChange()}
        onDoubleClick={() => this.onDoubleClick()}
        onClick={() => this.selectCol()}
      >
        {value}
      </div>
    )
  }
}
class Row extends React.Component {
  static propTypes = {
    row: PropTypes.number,
    data: PropTypes.array,
    editCol: PropTypes.func,
    clearEdit: PropTypes.func,
  }
  renderCols () {
    let arr = []
    for (let i = 0; i < 10; i++) {
      arr.push(
        <Col
          key={`${this.props.row}-${i}`}
          row={this.props.row}
          col={i}
          data={this.props.data[i]}
          editCol={this.props.editCol}
          clearEdit={this.props.clearEdit}
        />)
    }
    return arr
  }
  render () {
    return (
      <div className='row-container'>
        <p
          className='col'
          onDoubleClick={() => this.onDoubleClick()}
        >
          {this.props.row + 1}
        </p>
        {this.renderCols()}
      </div>
    )
  }
}
class Master extends React.PureComponent {
  static propTypes = {
    cellData: PropTypes.array,
    currentSelection: PropTypes.object,
    editCol: PropTypes.func,
    clearEdit: PropTypes.func,
    updateCellData: PropTypes.func,
  }

  componentDidMount () {
    window.addEventListener('keydown', (e) => this.handleKeyDown(e))
  }
  componentWillUnmount () {
    window.removeEventListener('keydown', (e) => this.handleKeyDown(e))
  }
  selectCol (x, y) {
    const { editCol, clearEdit } = this.props
    clearEdit()
    editCol({
      attr: {
        isSelected: true,
      },
      x,
      y,
    })
  }
  handleKeyDown (e) {
    console.log(e)
    const { currentSelection, cellData } = this.props
    const { x, y } = currentSelection
    if (Keyboard.isEnter(e)) {
      e.preventDefault()
    }
    // Y-Direction
    if (Keyboard.isUp(e)) {
      if (x) {
        e.preventDefault()
        this.selectCol(x - 1, y)
      }
    }
    if (Keyboard.isDown(e)) {
      if (x !== cellData.length - 1) {
        e.preventDefault()
        this.selectCol(x + 1, y)
      }
    }
    // X-direction

    if (Keyboard.isLeft(e)) {
      if (y) {
        e.preventDefault()
        this.selectCol(x, y - 1)
      }
    }
    if (Keyboard.isRight(e)) {
      if (y !== cellData[0].length - 1) {
        e.preventDefault()
        this.selectCol(x, y + 1)
      }
    }
    if (Keyboard.isDelete(e)) {
      e.preventDefault()
      this.props.updateCellData({
        value: ''
      })
    }
    if (Keyboard.isBold(e)) {
      e.preventDefault()
      if (x === -1 && y === -1) {
        return
      }
      this.props.updateCellData({
        bold: !cellData[x][y].bold
      })
    }
    if (Keyboard.isUnderLine(e)) {
      e.preventDefault()
      if (x === -1 && y === -1) {
        return
      }
      this.props.updateCellData({
        underline: !cellData[x][y].underline
      })
    }
    if (Keyboard.isItalics(e)) {
      e.preventDefault()
      if (x === -1 && y === -1) {
        return
      }
      this.props.updateCellData({
        italics: !cellData[x][y].italics
      })
    }
  }
  renderRows () {
    let arr = []
    for (let i = 0; i < 40; i++) {
      arr.push(
        <Row
          key={i}
          row={i}
          data={this.props.cellData[i]}
          editCol={this.props.editCol}
          clearEdit={this.props.clearEdit}
        />)
    }
    return arr
  }
  render () {
    return (
      <div style={{ overflow: 'scroll' }}>
        { this.renderRows() }
      </div>
    )
  }
}

export default Master
