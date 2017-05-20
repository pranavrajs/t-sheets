import React from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'

import colNameResolver from '../helper';

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

export class ColHeader extends React.PureComponent {
  static propTypes = {
    contentLength: PropTypes.number,
  }

  render () {
    let colArr = new Array(this.props.contentLength).fill(0);
    colArr = colArr.map((el, index) => (
      <p key={index} className='col-header'>{colNameResolver(index + 1)}</p>
    ))
    return (
      <div className='row-container'>
        {
          [
            <p className='row-header'>&nbsp;</p>,
            ...colArr
          ]
        }
      </div>
    )
  }
}
