import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { Card, CardMedia, CardTitle, CardText, CardActions } from 'react-toolbox/lib/card'
import Button from 'react-toolbox/lib/button/Button'

const icons = require.context('../icons/')

class Shop extends Component {

  componentWillMount() {
    this.props.dispatch({
      type: 'GET_INTENT'
    })
  }

  checkout(intent) {
    this.props.dispatch({
      type: 'START_CHECKOUT',
      intent
    })
  }

  render() {
    const { intents } = this.props
    const intentCards = intents.map(intent => (
      intent.of &&
      <Card key={intent.of.address} style={{ marginBottom: '1rem' }}>
        <CardTitle
          avatar={icons(`./${intent.of.ticker}.png`)}
          title={`${intent.of.name} (${intent.of.ticker})`}
        />
        <CardMedia
          aspectRatio="wide"
          image={intent.of.cover}
        />
        <CardText>{+intent.amount} tokens available.</CardText>
        <CardActions>
          <Button onClick={() => this.checkout(intent)}>Get a Quote</Button>
        </CardActions>
      </Card>
    ));

    return <div>{intentCards}</div>
  }
}

Shop.propTypes = {
  intents: PropTypes.array.isRequired,
  dispatch: PropTypes.func.isRequired
}

const mapStateToProps = state => (
  {
    intents: state.shop.available.map(intent => (
      {
        kind: 'sell',
        amount: intent.amount,
        of: state.tracking.available.find(token => (
          token.address === intent.of
        ))
      }
    ))
  }
);

export default connect(mapStateToProps)(Shop)
