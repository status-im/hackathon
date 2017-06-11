import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Dialog from 'react-toolbox/lib/dialog/Dialog';
import Slider from 'react-toolbox/lib/slider/Slider'

import { List, ListItem } from 'react-toolbox/lib/list'
import ProgressBar from 'react-toolbox/lib/progress_bar';

// We use a null address to indicate ether trades.
const NULL_ADDRESS = '0x0000000000000000000000000000000000000000'
const icons = require.context('../icons/')

class Checkout extends Component {

  state = {
    value: 1,
    active: false
  }

  getOrder(token) {
    this.props.dispatch({
      type: 'GET_ORDER',
      makerAmount: this.state.value,
      makerToken: this.props.purchasing.of.address,
      takerAddress: this.state.address,
      takerToken: token.address
    })
  }

  getQuotes() {
    this.props.dispatch({
      type: 'GET_QUOTES',
      makerAmount: this.state.value,
      makerToken: this.props.purchasing.of.address,
      takerTokens: this.props.tokens.map(token => (token.address)).concat(NULL_ADDRESS)
    })
  }

  takeOrder() {
    this.props.dispatch({
      type: 'FILL',
      order: this.props.order
    })
  }

  closeModal() {
    this.props.dispatch({
      type: 'CLOSE_CHECKOUT'
    });
  }

  findQuote(address) {
    const found = this.props.quotes.find(quote => (
      quote.takerToken === address
    ))
    return found
  }

  timeout = null
  handleChange = (value) => {
    this.setState({
      value
    })
    clearTimeout(this.timeout)
    this.timeout = setTimeout(() => {
      this.getQuotes()
    }, 500)
  }

  render() {
    let content = null
    let title = null
    let actions = []

    if (this.props.purchasing) {
      title = `Price quotes for ${this.props.purchasing.of.ticker}`

      let tokens = null

      if (this.props.order) {
        actions = [
          { label: 'Cancel', onClick: () => this.closeModal() },
          { label: 'Take it!', onClick: () => this.takeOrder() }
        ]

        title = 'Take this order'
        content = (
          <div>
            <div>Please confirm that you&apos;d like to fill this order.</div>
          </div>
        )
      } else if (this.props.quotes) {
        actions = [
          { label: 'Cancel', onClick: () => this.closeModal() }
        ]

        tokens = this.props.quotes.map((quote) => {
          if (!quote.error) {
            let token = this.props.tokens.find(takerToken => (
              quote.takerToken === takerToken.address
            ))

            let legend
            if (!token) {
              token = {
                ticker: 'ETH',
                address: NULL_ADDRESS,
                name: 'Ether'
              }
              legend = 'Purchase with ether.'
            } else if (this.props.allowances[token.address] >
              this.findQuote(token.address).takerAmount) {
              legend = 'You&apos;ve allowed enough for this trade.'
            } else {
              legend = 'You have not allowed enough for this trade.'
            }

            return (
              <ListItem
                key={token.address}
                avatar={icons(`./${token.ticker}.png`)}
                caption={`${this.findQuote(token.address).takerAmount} ${token.ticker} (${token.name})`}
                legend={legend}
                rightIcon="keyboard_arrow_right"
                onClick={() => this.getOrder(token)}
              />
            )
          }
          return null
        })
        content = (
          <div>
            <div>Please select an amount you&apos;d like.</div>
            <Slider
              min={0}
              max={+this.props.purchasing.amount}
              editable
              step={1}
              value={this.state.value}
              onChange={this.handleChange}
            />
            <List>
              {tokens}
            </List>
          </div>
        )
      } else {
        tokens = (
          <div style={{ textAlign: 'center' }}>
            <ProgressBar type="circular" mode="indeterminate" />
          </div>
        )
        content = (
          <div>
            <div>Please select an amount you&apos;d like.</div>
            <Slider
              min={0}
              max={+this.props.purchasing.amount}
              editable
              step={1}
              value={this.state.value}
              onChange={this.handleChange}
            />
            <List>
              {tokens}
            </List>
          </div>
        )
      }
    }

    return (
      <Dialog
        actions={actions}
        active={!!this.props.purchasing}
        onEscKeyDown={() => this.closeModal()}
        onOverlayClick={() => this.closeModal()}
        title={title}
      >
        {content}
      </Dialog>
    )
  }
}

Checkout.propTypes = {
  address: PropTypes.string,
  purchasing: PropTypes.shape({
    amount: PropTypes.string,
    kind: PropTypes.string,
    of: PropTypes.shape({
      address: PropTypes.string,
      ticker: PropTypes.string,
      name: PropTypes.string
    })
  }),
  allowances: PropTypes.shape({
    address: PropTypes.string,
    amount: PropTypes.number
  }).isRequired,
  tokens: PropTypes.array.isRequired,
  quotes: PropTypes.array,
  order: PropTypes.shape({
    makerAddress: PropTypes.string,
    makerAmount: PropTypes.number,
    makerToken: PropTypes.string,
    takerAddress: PropTypes.string,
    takerAmount: PropTypes.number,
    takerToken: PropTypes.string,
    signature: PropTypes.string,
    expiration: PropTypes.number,
    nonce: PropTypes.string
  }),
  dispatch: PropTypes.func.isRequired
}

Checkout.defaultProps = {
  address: null,
  purchasing: null,
  ether: null,
  quotes: null,
  order: null
}

const mapStateToProps = state => ({
  address: state.tracking.address,
  purchasing: state.shop.purchasing,
  tokens: state.tracking.available.filter((token) => {
    if (state.shop.purchasing && (state.shop.purchasing.of.address === token.address)) {
      return false
    }
    return token.address in state.tracking.allowances &&
      state.tracking.allowances[token.address] !== 0
  }),
  ether: state.tracking.ether,
  allowances: state.tracking.allowances,
  quotes: state.shop.quotes
});

export default connect(mapStateToProps)(Checkout)
