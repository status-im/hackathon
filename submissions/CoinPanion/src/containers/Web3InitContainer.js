import { connect } from 'react-redux'
import Web3Init from '../components/Web3Init'
import { web3Initialize } from '../actions/web3'

const mapStateToProps = (state, ownProps) => {
  return {
    web3: state.web3
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onWeb3ComponentLoad: web3 => {
      dispatch(web3Initialize(web3))
    }
  }
}

const Web3InitContainer = connect(mapStateToProps, mapDispatchToProps)(Web3Init)

export default Web3InitContainer
