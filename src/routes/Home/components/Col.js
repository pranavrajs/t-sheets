import React from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'

import colNameResolver from '../helper'

export default class Col extends React.PureComponent {
  static propTypes = {
    row: PropTypes.number,
    col: PropTypes.number,
    data: PropTypes.object,
    editCol: PropTypes.func,
    clearEdit: PropTypes.func,
  }
  onKeyDown (e) {
    console.log(e)
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
    setTimeout(() => {
      ReactDOM.findDOMNode(this).focus()
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
    const { data, row, col } = this.props
    const { value, contentEditable } = data
    return (
      <div
        id={`col-${row}${col}`}
        className={this.computeClasses()}
        contentEditable={contentEditable}
        onBlur={() => this.emitChange()}
        onDoubleClick={() => this.onDoubleClick()}
        onClick={() => this.selectCol()}
      >
        {value}
      </div>
    )
  }
}

export class ColHeader extends React.PureComponent {
  static propTypes = {
    contentLength: PropTypes.number,
    insertCol: PropTypes.func,
    deleteCol: PropTypes.func,
  }

  render () {
    let colArr = new Array(this.props.contentLength).fill(0)
    colArr = colArr.map((el, index) => (
      <div className='dropdown col-header' key={index}>
        <button
          className='btn btn-secondary dropdown-toggle'
          type='button'
          id={`d-${index}`}
          data-toggle='dropdown'
          aria-haspopup
          aria-expanded='false'
        >
          <p key={index}>{colNameResolver(index)}</p>
        </button>
        <div className='dropdown-menu' aria-labelledby={`d-${index}`}>
          <a className='dropdown-item' onClick={() => this.props.insertCol(index, 'left')}>Insert 1 left</a>
          <a className='dropdown-item' onClick={() => this.props.insertCol(index, 'right')}>Insert 1 right</a>
          <a className='dropdown-item' onClick={() => this.props.deleteCol(index)}>Delete Column</a>
        </div>
      </div>
    ))
    return (
      <div className='row-container'>
        {[
          <p key={-1} className='row-header'>&nbsp;</p>,
          ...colArr
        ]}
      </div>
    )
  }
}
