import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import AppBar from 'react-toolbox/lib/app_bar/AppBar'
import Tab from 'react-toolbox/lib/tabs/Tab'
import Tabs from 'react-toolbox/lib/tabs/Tabs'

import Dialog from 'react-toolbox/lib/dialog/Dialog';
import Checkout from './Checkout'
import Approval from './Approval'

import Shop from './Shop'
import Balances from './Balances'
import History from './History'

const icons = require.context('../icons/')

class App extends Component {
  state = {
    tabIndex: 0
  }
  tabChange = (index) => {
    this.setState({ tabIndex: index });
  }

  render() {
    const logo = <img style={{ height: '100%' }} alt="Swap" src={icons('./swap.png')} />

    if (this.props.error) {
      console.error(this.props.error)
    }

    return (
      <div>
        <AppBar title="Swap Shop" leftIcon={logo} rightIcon="account_circle" />
        <Tabs index={this.state.tabIndex} onChange={this.tabChange} fixed>
          <Tab label="Shop"><Shop /></Tab>
          <Tab label="Balances"><Balances /></Tab>
          <Tab label="History"><History /></Tab>
        </Tabs>
        <Checkout />
        <Approval />
        <Dialog
          actions={[{ label: 'Reload', onClick: () => window.location.reload() }]}
          active={!!this.props.error}
          title="Error"
        >
          There was an error. {this.props.error}
        </Dialog>
      </div>
    )
  }
}

App.propTypes = {
  error: PropTypes.string
}

App.defaultProps = {
  error: null
}

const mapStateToProps = state => ({
  error: state.tracking.error
})

export default connect(mapStateToProps)(App)
