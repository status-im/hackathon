import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { List, ListItem, ListSubHeader } from 'react-toolbox/lib/list'

function History({ log }) {
  const transactionList = log.map(transaction => (
    <ListItem
      caption={transaction.description}
      legend={new Date(transaction.timestamp).toLocaleString()}
      key={transaction.hash}
    />
  ));

  let greeting = null
  if (transactionList.length === 0) {
    greeting = <ListSubHeader caption={'You haven\'t made any transactions yet.'} />
  }
  return (
    <List>
      {greeting}
      {transactionList}
    </List>
  )
}

History.propTypes = {
  log: PropTypes.array.isRequired
}

const mapStateToProps = state => ({
  log: state.orders.all
});

export default connect(mapStateToProps)(History)
