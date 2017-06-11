import Web3 from 'web3'
import promisify from 'es6-promisify'
import truffleConfig from './../../truffle-config.js'
import * as actionTypes from './actionTypes'
import VaultContract from '../../build/contracts/Vault.json'
import { getUser } from './profile'
const web3Location = `http://${truffleConfig.networks.development.host}:${truffleConfig.networks.development.port}`
import firebase from 'firebase'
import * as querybase from 'querybase'

function web3Init(web3) {
  return {
    type: actionTypes.WEB_3_INITIALIZE,
    payload: web3
  }
}

export function web3Initialize() {
  return function(dispatch) {
    let web3Provided
    if (typeof web3 !== 'undefined') {
      console.log('Using Injected Web3')
      // eslint-disable-next-line
      // eslint-disable-next-line
      web3Provided = new Web3(web3.currentProvider)
    } else {
      console.log('Using Local Web3')
      // DEVELOPER NOTE: What happens in the wild if the
      // user does not have a browser based wallet? What happens
      // if the Web3 object cannot be initialized with the httpProvider
      // given from the loction in the truffle-config file?
      web3Provided = new Web3(new Web3.providers.HttpProvider(web3Location))
    }
    dispatch(web3Init(web3Provided))
    return web3Provided
  }
}

export function getVault(web3) {
  return async (dispatch, getState) => {
    const provider = web3.currentProvider
    console.log(provider)
    web3.version.getNetwork((err, netId) => {
      switch (netId) {
        case '1':
          console.log('This is mainnet')
          break
        case '2':
          console.log('This is the deprecated Morden test network.')
          break
        case '3':
          console.log('This is the ropsten test network.')
          break
        default:
          console.log('This is an unknown network.')
      }
    })
    const contract = require('truffle-contract')
    // So we can update state later.
    const vault = contract(VaultContract)
    vault.setProvider(provider)
    window.vaulty = vault
    const getAccountsPromise = promisify(web3.eth.getAccounts)
    const getBalancePromise = promisify(web3.eth.getBalance)
    const [userAddress] = await getAccountsPromise()
    const userBalance = await getBalancePromise(userAddress)
    const databaseRefUsers = firebase.database().ref().child('users')
    const usersRef = querybase.ref(databaseRefUsers, [])
    const snap = await usersRef.where({ eth_address: userAddress }).once('value')
    const myProfile = snap.val() ? Object.values(snap.val())[0] : {}
    const address = myProfile.vault_address
    let vaultInstance = {},
      vaultBalance
    if (address) {
      vaultInstance = await vault.at(address) // .deployed(userAddress, userAddress, 0, 0, userAddress, 0)
      vaultInstance.authorizeSpender(userAddress, true, { from: userAddress })

      window.vaultInstancey = vaultInstance
      vaultBalance = await getBalancePromise(vaultInstance.address)
    }
    dispatch({
      type: actionTypes.GET_CONTRACT_DATA,
      payload: {
        userAddress,
        userBalance,
        contract: vaultInstance,
        contractBalance: vaultBalance
      }
    })
    dispatch(getUser(myProfile))
  }
}

export function loadVault(loadVaultValue) {
  return async (dispatch, getState) => {
    const { contract: vault, web3Provider: web3, userAddress } = getState().web3
    console.warn(userAddress, vault)
    const result = await vault.receiveEther({ from: userAddress, value: loadVaultValue })
    _waitForTxToBeMined(web3, result.tx)
    console.log('Mined TX:', result.tx)
    const getBalancePromise = promisify(web3.eth.getBalance)

    const contractResponse = await getBalancePromise(vault.address, web3.eth.defaultBlock)
    const userResponse = await getBalancePromise(userAddress, web3.eth.defaultBlock)
    const contractBalance = contractResponse.toNumber()
    const userBalance = userResponse.toNumber()
    dispatch({ type: actionTypes.LOAD_VAULT, payload: { contractBalance, userBalance } })
  }
}

export function initVault(userAddress, id) {
  return async (dispatch, getState) => {
    const { web3Provider: web3 } = getState().web3
    const contract = require('truffle-contract')
    const vault = contract(VaultContract)
    vault.setProvider(web3.currentProvider)
    const vaultInstance = await vault.new(userAddress, userAddress, 0, 0, userAddress, 0, { from: userAddress })
    firebase.database().ref(`users/${id}`).update({ vault_address: vaultInstance.address })
    const result = await vaultInstance.authorizeSpender(userAddress, true, { from: userAddress })
    console.warn(result)
    const getBalancePromise = promisify(web3.eth.getBalance)
    const contractResponse = await getBalancePromise(vaultInstance.address, web3.eth.defaultBlock)
    const contractBalance = contractResponse.toNumber()
    dispatch({ type: actionTypes.INIT_VAULT, payload: { contractBalance, contract: vaultInstance } })
  }
}

export function coinSomeone({ coinSomeoneValue, coinSomeoneAddress, subscriptionDelay }) {
  return async (dispatch, getState) => {
    const { contract: vault, web3Provider: web3, userAddress } = getState().web3
    // CHANGE NAME
    const result = await vault.authorizePayment(
      'alon',
      coinSomeoneAddress,
      Number(coinSomeoneValue),
      Number(subscriptionDelay),
      {
        from: userAddress,
        gas: 500000
      }
    )
    _waitForTxToBeMined(web3, result.tx)
    console.log('Mined TX:', result.tx)
    console.log(('Result', result))
    const payment_id = result.logs[0].args.idPayment.toString()
    const object = {
      payment_id,
      coiner_vault_address: vault.address,
      coiner: userAddress,
      coinee: coinSomeoneAddress,
      eth_amount: web3.fromWei(coinSomeoneValue, 'ether').toString(),
      payout_timestamp_ms: Date.now() + subscriptionDelay * 1000 // convert seconds to ms
    }
    console.log(object)
    firebase.database().ref().child('coinings').push().set(object)
    const getBalancePromise = promisify(web3.eth.getBalance)
    const contractResponse = await getBalancePromise(vault.address, web3.eth.defaultBlock)
    const contractBalance = contractResponse.toNumber()
    console.log(`User: ${userAddress} - UserVault: ${result.toString()}`)
    console.log('Vault Balance:', contractBalance)
    dispatch({ type: actionTypes.COIN_SOMEONE, payload: { contractBalance } })
  }
}

async function _waitForTxToBeMined(web3, txHash) {
  let txReceipt
  while (!txReceipt) {
    try {
      txReceipt = await web3.eth.getTransactionReceipt(txHash, web3.eth.defaultBlock, result => {
        console.log(result)
      })
    } catch (err) {
      return console.log(err)
    }
  }
  console.log(txReceipt)
}
