import Config from '../truffle.js'
import Web3 from 'web3'

let web3RPC = null

window.addEventListener('load', function() {
  if (typeof window.web3 !== 'undefined') {
    web3RPC = new Web3(window.web3.currentProvider)
  } else {
    console.warn('Using development environment')
    var {host, port} = Config.networks['development']
    const provider = new Web3.providers.HttpProvider('http://' + host + ':' + port)
    web3RPC = new Web3(provider)
  }
})

export const getEthAddress = () => {
  return web3RPC.eth.accounts[0]
}

export const sendEth = (fromAddress, toAddress, amount) => {
  const value = web3RPC.toWei(amount, 'ether')
  const data = {
    from: fromAddress,
    to: toAddress,
    value: value
  }
  console.log(`Sending ${data.value} wei to ${toAddress}`)
  web3RPC.eth.sendTransaction(data, function(error, address) {
    if (error) {
      console.warn(error)
    } else {
      console.log(`Success: ${address}`)
    }
  })
}
