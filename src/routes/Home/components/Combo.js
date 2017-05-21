import React from 'react'
import PropTypes from 'prop-types'

export default class Col extends React.PureComponent {
  static propTypes = {
    index: PropTypes.number,
    title: PropTypes.string,
    actions: PropTypes.array,
    className: PropTypes.string,
  }
  render () {
    const { index, title, className, actions } = this.props
    return (
      <div className={`dropdown ${className}`} key={index}>
        <button
          className='btn btn-secondary dropdown-toggle'
          type='button'
          id={`d-${index}`}
          data-toggle='dropdown'
          aria-haspopup
          aria-expanded='false'
        >
          <p key={index}>{title}</p>
        </button>
        <div className='dropdown-menu' aria-labelledby={`d-${index}`}>
          {actions.map((el) => (
            <a className='dropdown-item' onClick={() => el.action}>
              {el.label}
            </a>
          ))}
        </div>
      </div>
    )
  }
}
