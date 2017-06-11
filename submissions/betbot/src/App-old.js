import React, { Component } from 'react'
import PeerCoinContract from '../build/contracts/PeerCoin.json'
import Config from '../truffle.js'
import Web3 from 'web3'
import './App.css'

import {createSampleGroups} from './test/testTruffle.js'

class App extends Component {
  constructor(props) {
    super(props)

    this.createGroup = this.createGroup.bind(this)
    this.sendMoney = this.sendMoney.bind(this)
    this.listYourGroups = this.listYourGroups.bind(this)
    this.viewBalance = this.viewBalance.bind(this)
    this.setInputId = this.setInputId.bind(this)
    this.setInputGroup = this.setInputGroup.bind(this)
    this.setInputToAccount = this.setInputToAccount.bind(this)
    this.setInputAmount = this.setInputAmount.bind(this)

    this.state = {
      groupNameInput: '',
      groupIdInput: '',
      amountInput: 0,
      toAccountInput: '',
      groupIDs: [],
      groupNames: [],
      ballance: []
    }
  }

  componentWillMount() {
    // createSampleGroups()
  }

  createGroup() {
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

    console.log('before get accounts')
    web3RPC.eth.getAccounts(function(error, accounts) {
      console.log('in get accounts', accounts)
      peerCoin.deployed().then(function(instance) {
        peerCoinInstance = instance
        console.log('adding',self.state.groupIdInput, self.state.groupNameInput)
        return peerCoinInstance.createGroup(self.state.groupIdInput, self.state.groupNameInput, {from: accounts[0]})
      }).then(function(a) {
        peerCoinInstance.getGroupName(self.state.groupIdInput).then(function(result) {
          console.log( window.web3.toAscii(result))
        })
      })
    })
    console.log('after get accounts')
  }
  listYourGroups() {
    console.log('LIST YOUR GROUPS')
    var self = this

    // var {host, port} = Config.networks[process.env.NODE_ENV]
    // const provider = (typeof window.web3 == 'undefined')?
    //                   new Web3.providers.HttpProvider('http://' + host + ':' + port)
    //                   : window.web3.currentProvider
    const provider = window.web3.currentProvider
    const contract = require('truffle-contract')
    const peerCoin = contract(PeerCoinContract)
    peerCoin.setProvider(provider)

    const web3RPC = new Web3(provider)

    var peerCoinInstance

    console.log('before get accounts')
    web3RPC.eth.getAccounts(function(error, accounts) {
      console.log('in get accounts', accounts)
      peerCoin.deployed().then(function(instance) {
        peerCoinInstance = instance

        peerCoinInstance.listGroups().then(function(result) {
          console.log('working')
          // console.log( window.web3.toAscii(result))
          console.log( String(result[2][0]))
          self.setState(
            {
              ...self.state,
              // ids: result[0].map(i => window.web3.toAscii(i)),
              // lastNames: result[1].map(i => window.web3.toAscii(i)),
              // ages: String(result[2]).split(',') // this is a bit of a hack to get an array of int strings from bigints
              groupIDs: result[0].map(i => window.web3.toAscii(i)),
              groupNames: result[1].map(i => window.web3.toAscii(i)),
              groupBalance: String(result[2]).split(',')
            }
          )
        })
      })
    })
    console.log('after get accounts')
  }
  sendMoney() {
    console.log('LIST YOUR GROUPS')
    var self = this

    // var {host, port} = Config.networks[process.env.NODE_ENV]
    // const provider = (typeof window.web3 == 'undefined')?
    //                   new Web3.providers.HttpProvider('http://' + host + ':' + port)
    //                   : window.web3.currentProvider
    const provider = window.web3.currentProvider
    const contract = require('truffle-contract')
    const peerCoin = contract(PeerCoinContract)
    peerCoin.setProvider(provider)

    const web3RPC = new Web3(provider)

    var peerCoinInstance

    web3RPC.eth.getAccounts(function(error, accounts) {
      peerCoin.deployed().then(function(instance) {
        peerCoinInstance = instance

        peerCoinInstance.sendToken(self.state.toAccountInput,"a", self.state.amountInput, {from: accounts[0]}).then(function(result) {
          console.log('sent funds', result)
        })
      })
    })
    console.log('after get accounts')
  }
  viewBalance() {
    console.log('LIST YOUR GROUPS')
    var self = this

    // var {host, port} = Config.networks[process.env.NODE_ENV]
    // const provider = (typeof window.web3 == 'undefined')?
    //                   new Web3.providers.HttpProvider('http://' + host + ':' + port)
    //                   : window.web3.currentProvider
    const provider = window.web3.currentProvider
    const contract = require('truffle-contract')
    const peerCoin = contract(PeerCoinContract)
    peerCoin.setProvider(provider)

    const web3RPC = new Web3(provider)

    var peerCoinInstance

    web3RPC.eth.getAccounts(function(error, accounts) {
      peerCoin.deployed().then(function(instance) {
        peerCoinInstance = instance

        peerCoinInstance.getBallance("a", {from: accounts[0]}).then(function(result) {
          console.log('viewBalance', String(result))
        })
      })
    })
    console.log('after get accounts')
  }

  setInputGroup(e) {
    this.setState({
      ...this.state,
      groupNameInput: e.target.value
    })
  }

  setInputId(e) {
    this.setState({
      ...this.state,
      groupIdInput: e.target.value
    })
  }
  setInputToAccount(e) {
    this.setState({
      ...this.state,
      toAccountInput: e.target.value
    })
  }

  setInputAmount(e) {
    this.setState({
      ...this.state,
      amountInput: e.target.value
    })
  }

  render() {
    const groups = this.state.groupIDs.map((gID, i) =>
      <tr key={i}>
        <td>{gID}</td>
        <td>{this.state.groupNames[i]}</td>
        <td>{this.state.groupBalance[i]}</td>
      </tr>
    )
    return (
      <div className="App">
        <h1>BeerBot</h1>
        <p>Never forget who owes you a beer!</p>
        {/*<nav className="navbar pure-menu pure-menu-horizontal">
            <ul className="pure-menu-list">
                <li className="pure-menu-item"><a href="#" className="pure-menu-link">News</a></li>
                <li className="pure-menu-item"><a href="#" className="pure-menu-link">Sports</a></li>
                <li className="pure-menu-item"><a href="#" className="pure-menu-link">Finance</a></li>
            </ul>
        </nav>*/}
        <div>
          <p>Create Group:</p>
          <input placeholder={'Group Name'} value={this.state.groupNameInput} onChange={this.setInputGroup}/>
          <input placeholder={'Group ID'} value={this.state.groupIdInput} onChange={this.setInputId}/>
          <button onClick={this.createGroup}>Create Group</button>
          <p>Send Funds:</p>
          <input placeholder={'To address'} value={this.state.toAccountInput} onChange={this.setInputToAccount}/>
          <input placeholder={0} type="number" value={this.state.amountInput} onChange={this.setInputAmount}/>
          <button onClick={this.sendMoney}>Send Money</button>
          <button onClick={this.listYourGroups}>List Groups</button>
          <button onClick={this.viewBalance}>Get Ballance</button>
          <table>
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Ballance</th>
              </tr>
            </thead>
            <tbody>
              {groups}
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}

export default App
