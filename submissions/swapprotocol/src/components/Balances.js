import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { List, ListItem, ListDivider } from 'react-toolbox/lib/list'

const icons = require.context('../icons/')

class Balances extends Component {

  approve(token, balance) {
    this.props.dispatch({
      type: 'START_APPROVE',
      token,
      balance
    })
  }

  render() {
    const { available, ether, balances, allowances } = this.props

    const tokenCards = available.map(token => (
      <ListItem
        avatar={icons(`./${token.ticker}.png`)}
        caption={`${balances[token.address] || 0} ${token.ticker}`}
        legend={`${token.name} – ${allowances[token.address] || 0} approved for trading`}
        onClick={() => this.approve(token, balances[token.address])}
        key={token.address}
        rightIcon="keyboard_arrow_right"
      />
    ))

    return (
      <List selectable ripple>
        <ListItem
          avatar={icons('./ETH.png')}
          caption={`${ether || 0} ETH`}
          legend="Can be used to purchase tokens"
        />
        <ListDivider />
        {tokenCards}
      </List>
    )
  }
}

Balances.propTypes = {
  available: PropTypes.array.isRequired,
  ether: PropTypes.string,
  balances: PropTypes.shape({
    address: PropTypes.string,
    value: PropTypes.number
  }).isRequired,
  allowances: PropTypes.shape({
    address: PropTypes.string,
    value: PropTypes.number
  }).isRequired,
  dispatch: PropTypes.func.isRequired
}

Balances.defaultProps = {
  ether: null
}

const mapStateToProps = state => ({
  available: state.tracking.available,
  ether: state.tracking.ether,
  balances: state.tracking.balances,
  allowances: state.tracking.allowances
});

export default connect(mapStateToProps)(Balances)
