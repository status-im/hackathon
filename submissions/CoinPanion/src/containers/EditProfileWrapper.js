import React from 'react'
import { connect } from 'react-redux'
import EditProfile from 'components/EditProfile'

const EditProfileWrapper = props => <EditProfile {...props} />

function mapStateToProps({ profile, web3 }) {
  const { user } = profile
  const { web3Provider, userBalance, userAddress, contract, contractBalance } = web3
  return {
    user,
    web3: web3Provider,
    userBalance,
    userAddress,
    contract,
    contractBalance
  }
}

export default connect(mapStateToProps)(EditProfileWrapper)
