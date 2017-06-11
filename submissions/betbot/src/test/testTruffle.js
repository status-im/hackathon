import PeerCoinContract from '../../build/contracts/PeerCoin.json'
import Config from '../../truffle.js'
import Web3 from 'web3'

export const createSampleGroups = () => {
  console.log('create group')
  var self = this

  var {host, port} = Config.networks[process.env.NODE_ENV]
  const provider = (window.web3 === null)?
                    new Web3.providers.HttpProvider('http://' + host + ':' + port)
                    : window.web3.currentProvider
                    // const provider = new Web3.providers.HttpProvider('http://' + host + ':' + port)
  const contract = require('truffle-contract')
  const peerCoin = contract(PeerCoinContract)
  peerCoin.setProvider(provider)

  const web3RPC = new Web3(provider)

  var peerCoinInstance

  web3RPC.eth.getAccounts(function(error, accounts) {
    console.log('in get accounts', accounts)
    peerCoin.deployed().then(function(instance) {
      peerCoinInstance = instance
      console.log('adding',)
      peerCoinInstance.createGroup("a", "aname", {from: accounts[0]})
      peerCoinInstance.createGroup("b", "bname", {from: accounts[0]})
      peerCoinInstance.createGroup("c", "cname", {from: accounts[0]})
      // peerCoinInstance.createGroup(self.state.groupIdInput, self.state.groupNameInput, {from: accounts[0]})
    })
  })
}
