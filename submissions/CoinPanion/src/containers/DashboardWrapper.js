import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Dashboard from 'components/Dashboard'
import * as web3Actions from '../actions/web3'

const DashboardWrapper = props => <Dashboard {...props} />

function mapStateToProps({ profile, web3 }) {
  const { user } = profile
  const { web3Provider, userBalance, userAddress, contract, contractBalance } = web3
  return {
    user,
    web3: web3Provider,
    userBalance: web3Provider.fromWei(userBalance, 'ether').toString(),
    userAddress,
    contract,
    contractBalance: web3Provider.fromWei(contractBalance, 'ether').toString()
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...web3Actions }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardWrapper)
