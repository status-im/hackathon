import Web3 from 'web3'
import * as actionTypes from '../actions/actionTypes'
const provider = new Web3.providers.HttpProvider('http://localhost:8546')
const web3 = new Web3(provider)

const defaultState = {
  web3Provider: web3,
  userAddress: '0x0',
  userBalance: 0,
  contract: {
    address: '0x0'
  },
  contractBalance: 0
}

export default function web3Reducer(state = defaultState, action) {
  switch (action.type) {
    case actionTypes.WEB_3_INITIALIZE:
      return { ...state, ...{ web3Provider: action.payload } }
    case actionTypes.GET_CONTRACT_DATA:
      return { ...state, ...action.payload }
    case actionTypes.LOAD_VAULT:
      return { ...state, ...action.payload }
    case actionTypes.INIT_VAULT:
      return { ...state, ...action.payload }
    case actionTypes.COIN_SOMEONE:
      return { ...state, ...action.payload }
    default:
      return state
  }
}
