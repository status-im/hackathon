import React, { PropTypes } from 'react'
import { Button } from 'react-bootstrap'

const Results = ({ tab }) => {
  var payer
  
  if (tab.user_is_sender) {
    payer = `You paid your share of $${tab.total/tab.npeople}`
  }
  return (
    <div>
      <h1>{tab.shortid}</h1>
      <p>That's it! Results:</p>
      <p>{payer}</p>
      <h2>{tab.name}</h2>
      <p>Total: ${tab.total}</p>
    </div>
  )
}

Results.propTypes = {
}

export default Results
