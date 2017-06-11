import exchangeABI from './abi/exchange.json'
import tokenABI from './abi/token.json'

const CONTRACT_ADDRESS = '0x81c9817dd6d863b0c857cec50e12f50006cde5bb'

let requestId = 1
function getRequest(calls) {
  const body = JSON.stringify(
    calls.map(call => ({
      jsonrpc: '2.0',
      method: call.method,
      params: call.params,
      id: requestId++
    }))
  )
  return {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Content-Length': body.length
    },
    body
  }
}

function makeCall(fetch, request, resolve) {
  fetch('/proxy', request).then(response => (
    response.json()
  )).then((responses) => {
    resolve(responses.map(response => (
      response.result
    )))
  })
}

class Swap {

  constructor(web3, fetch, storage) {
    if (!web3) {
      throw new Error('Web3 was not provided.')
    }

    this.web3 = web3
    this.fetch = fetch
    this.storage = storage

    this.tokenContract = web3.eth.contract(tokenABI)
    this.exchangeContract = web3.eth.contract(exchangeABI).at(CONTRACT_ADDRESS)
  }

  /*
   * Web3 calls
   */

  getNetwork() {
    return new Promise((resolve) => {
      web3.version.getNetwork((err, network) => {
        this.network = network
        resolve(this.network)
      })
    })
  }

  getAddress() {
   return new Promise((resolve) => {
     resolve(this.web3.eth.accounts[0])
   })
  }

  getEtherBalance(address) {
    return new Promise((resolve, reject) => {
      this.web3.eth.getBalance(address, (error, result) => {
        if (error) {
          reject(error)
        } else {
          resolve(web3.fromWei(result.toNumber()))
        }
      })
    })
  }

  getBalance(token, address) {
    return new Promise((resolve, reject) => {
      this.tokenContract.at(token)
        .balanceOf(address, (error, result) => {
          if (error) {
            reject(error)
          } else {
            resolve(result.toNumber())
          }
      })
    })
  }

  getAllowance(token) {
    return new Promise((resolve, reject) => {
      this.tokenContract.at(token)
        .allowance(CONTRACT_ADDRESS, (error, result) => {
          if (error) {
            reject(error)
          } else {
            resolve(result.toNumber())
          }
      })
    })
  }

  approve(token, amount) {
    return new Promise((resolve, reject) => {
      this.tokenContract.at(token).approve(
        CONTRACT_ADDRESS, amount, (error, hash) => {
        if (error) {
          reject(error)
        } else {
          resolve(hash)
        }
      })
    })
  }

  fill(
    makerAmount, makerAddress, makerToken,
    takerAddress, takerAmount, takerToken,
    expiration, signature
    ) {
    return new Promise((resolve, reject) => {
      this.exchange.fill(makerAmount, makerAddress, makerToken,
      takerAddress, takerAmount, takerToken,
      expiration, signature, (error, hash) => {
        if (error) {
          reject(error)
        } else {
          resolve(hash)
        }
      })
    })
  }

  /*
   * HTTP calls
   */

  getIntent() {
    return new Promise((resolve, reject) => {
      makeCall(this.fetch, getRequest([{
        method: 'getIntent'
      }]), resolve, reject)
    })
  }

  getQuotes(makerAmount, makerToken, takerTokens) {
    return new Promise((resolve) => {
      const calls = takerTokens.map(takerToken => ({
        method: 'getQuote',
        params: [makerAmount, makerToken, takerToken]
      }))
      makeCall(this.fetch, getRequest(calls), resolve)
    })
  }

  getOrder(makerAmount, makerToken, takerAddress, takerToken) {
    return new Promise((resolve, reject) => {
      makeCall(this.fetch, getRequest([{
        method: 'getOrder',
        params: [makerAmount, makerToken, takerAddress, takerToken]
      }]), resolve, reject)
    })
  }

  /*
   * Storage calls
   */

  getHistory() {
    return new Promise((resolve) => {
      this.storage.read()
      resolve()
    })
  }
}

export default Swap
