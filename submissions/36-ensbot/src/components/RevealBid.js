import React, { Component } from 'react'
import { parse } from 'qs'
import { ethRegistrar } from '../ensutils'
import web3 from '../web3'
import Loader from 'react-loader'

class RevealBid extends Component {
  constructor(){
    super()
    this.state = {
      started: false,
      pending: false,
      txId: ""
    }
  }
  render(){
    let { match, location } = this.props
    const query = parse(location.search.substr(1))
    let txId = ""
    let { domain, bidAmount, secret} = query
    let split = domain.split('.'),
        name;
        name = split[0]

    if(this.state.started === false){
      txId = ethRegistrar.unsealBid(web3.sha3(name), web3.toWei(bidAmount, 'ether'), web3.sha3(secret), {from: web3.eth.accounts[0], gas: 500000});
      this.setState({
        started: true,
        txId
      })
      let interval = setInterval(()=>{
        let tx = web3.eth.getTransaction(txId)
        if(tx.blockNumber !== null){
          this.setState({
            pending: true,
            txId
          })
          clearInterval(interval)
        }
      }, 1000)
    }

    return <div>
      Bid {bidAmount} ether for {query.domain} with the secret {secret} has been revealed! This is the txId: <a href={`https://ropsten.etherscan.io/tx/${this.state.txId}`}>{this.state.txId}</a>
      {this.state.pending ? <div>Transaction has been mined and bid has been made!</div> : <div>Waiting for Transaction to be mined<Loader /></div>}
    </div>
  }
}

export default RevealBid
