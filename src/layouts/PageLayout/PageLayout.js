import React from 'react'
import PropTypes from 'prop-types'
import './PageLayout.scss'

export const PageLayout = ({ children }) => (
  <div style={{ overflow: 'scroll', resize: 'both' }}>
    <nav className='navbar navbar-light bg-faded'>
      <a className='navbar-brand'>
        T-SHEETS
      </a>
    </nav>
    {children}
  </div>
)
PageLayout.propTypes = {
  children: PropTypes.node,
}

export default PageLayout
