import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Profile from 'components/Profile'
import * as web3Actions from '../actions/web3'

const ProfileWrapper = props => <Profile {...props} />

function mapStateToProps(state) {
  const { profile: { user }, web3: { web3Provider } } = state
  console.log(state)
  return { myProfile: user, web3: web3Provider }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...web3Actions }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(ProfileWrapper)
