import React from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'

import Keyboard from './keyboard'
import './HomeView.scss'
import Row from './Row'
import { ColHeader } from './Col'

class Master extends React.Component {
  static propTypes = {
    cellData: PropTypes.array,
    currentSelection: PropTypes.object,
    editCol: PropTypes.func,
    clearEdit: PropTypes.func,
    updateCellData: PropTypes.func,
    insertCol: PropTypes.func,
    deleteCol: PropTypes.func,
    insertRow: PropTypes.func,
    deleteRow: PropTypes.func,
  }
  state ={
    clipboard: {

    }
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
    if (Keyboard.isEnter(e)) {
      if (x !== cellData.length - 1) {
        e.preventDefault()
        const domObj = document.getElementById(`col-${x}${y}`)
        const value = ReactDOM.findDOMNode(domObj).innerHTML
        if (cellData[x][y].value === value) {
          return
        }
        this.props.editCol({
          attr: {
            value,
          },
          x,
          y,
        })
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
      if (x === -1 && y === -1) return
      this.props.updateCellData({
        italics: !cellData[x][y].italics
      })
    }

    if (Keyboard.isCopyCommand(e)) {
      e.preventDefault()
      console.log(x, y, cellData[x][y])
      this.setState({
        clipboard: cellData[x][y]
      })
    }
    if (Keyboard.isCutCommand(e)) {
      e.preventDefault()
      this.props.updateCellData({
        value: ''
      })
      this.setState({
        clipboard: cellData[x][y]
      })
    }
    if (Keyboard.isPasteCommand(e)) {
      e.preventDefault()
      const { clipboard } = this.state
      const { x, y } = this.props.currentSelection
      if (x === -1 && y === -1) return
      if (!clipboard.value) return
      this.props.updateCellData({
        ...clipboard,
        x,
        y,
      })
    }
  }
  renderRows () {
    let arr = []
    for (let i = 0; i < this.props.cellData.length; i++) {
      arr.push(
        <Row
          key={i}
          row={i}
          data={this.props.cellData[i]}
          editCol={this.props.editCol}
          clearEdit={this.props.clearEdit}
          insertRow={this.props.insertRow}
          deleteRow={this.props.deleteRow}
        />)
    }
    return arr
  }
  exportToCSV () {
    const { cellData } = this.props
    let csvContent = 'data:text/csv;charset=utf-8,'
    cellData.forEach((row, index) => {
      const rowData = row.map((el) => {
        return el.value
      }).join(',')
      csvContent += index < cellData.length ? `${rowData}\n` : rowData
    })
    const encodedUri = encodeURI(csvContent)
    location.href = encodedUri
  }
  render () {
    return (
      <div style={{ overflow: 'scroll' }}>
        <button
          className='export btn'
          onClick={() => this.exportToCSV()}
        >
          Export to CSV
        </button>
        <ColHeader
          contentLength={this.props.cellData[0].length}
          insertCol={this.props.insertCol}
          deleteCol={this.props.deleteCol}
        />
        { this.renderRows() }
      </div>
    )
  }
}

export default Master
