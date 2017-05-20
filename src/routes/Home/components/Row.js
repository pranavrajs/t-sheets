import React from 'react'
import PropTypes from 'prop-types'

import Col from './Col'

export default class Row extends React.PureComponent {
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
          className='row-header'
          onDoubleClick={() => this.onDoubleClick()}
        >
          {this.props.row + 1}
        </p>
        {this.renderCols()}
      </div>
    )
  }
}
