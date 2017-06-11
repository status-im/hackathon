import React from 'react'
import PropTypes from 'prop-types'

const style = {
  padding: '0.5rem',
  margin: '0 0.5rem 0.5rem',
  display: 'flex',
  alignItems: 'flex-start'
}

const labelStyle = {
  flex: 1,
  fontSize: '1rem'
}

const Header = ({ label }) => (
  <div style={style}>
    <div style={labelStyle}>{label}</div>
  </div>
)

Header.propTypes = {
  label: PropTypes.string.isRequired
}

Header.defaultProps = {
  onRefresh: null
}

export default Header
