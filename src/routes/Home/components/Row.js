import React from 'react'
import PropTypes from 'prop-types'

import Col from './Col'

export default class Row extends React.PureComponent {
  static propTypes = {
    row: PropTypes.number,
    data: PropTypes.array,
    editCol: PropTypes.func,
    clearEdit: PropTypes.func,
    insertRow: PropTypes.func,
    deleteRow: PropTypes.func,
  }
  renderCols () {
    let arr = []
    for (let i = 0; i < this.props.data.length; i++) {
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
        <div className='dropdown row-header'>
          <button
            className='btn btn-secondary dropdown-toggle'
            type='button'
            id={`d-${this.props.row}`}
            data-toggle='dropdown'
            aria-haspopup
            aria-expanded='false'
          >
            <p key={this.props.row}>
              {this.props.row + 1}
            </p>
          </button>
          <div className='dropdown-menu' aria-labelledby={`d-${this.props.row}`}>
            <a className='dropdown-item' onClick={() => this.props.insertRow(this.props.row, 'up')}>
              Insert 1 up
            </a>
            <a className='dropdown-item' onClick={() => this.props.insertRow(this.props.row, 'below')}>
              Insert 1 below
            </a>
            <a className='dropdown-item' onClick={() => this.props.deleteRow(this.props.row)}>
              Delete Column
            </a>
          </div>
        </div>

        {this.renderCols()}
      </div>
    )
  }
}
