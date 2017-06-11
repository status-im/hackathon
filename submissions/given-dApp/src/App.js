import React, { Component } from 'react'
import SimpleStorageContract from '../build/contracts/SimpleStorage.json'
import Config from '../truffle.js'
import Web3 from 'web3'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'
import logo from './img/care.png'
class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      storageValue: 0,
      balance: 'Nothing',
    }
  }

  componentWillMount() {
    /*
     * SMART CONTRACT EXAMPLE
     *
     * Normally these functions would be called in the context of a
     * state management library, but for convenience I've placed them here.
     */

    // So we can update state later.
    var self = this

    // Get the RPC provider and setup our SimpleStorage contract.
    var {host, port} = Config.networks[process.env.NODE_ENV]
    
    const provider = new Web3.providers.HttpProvider('http://' + host + ':' + port)
    const contract = require('truffle-contract')
    const simpleStorage = contract(SimpleStorageContract)
    simpleStorage.setProvider(provider)

    // Get Web3 so we can get our accounts.
    const web3RPC = new Web3(provider)

    // Declaring this for later so we can chain functions on SimpleStorage.
    var simpleStorageInstance
   // const balance = web3RPC.eth.getBalance("0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe")
   // this.setState({ balance: balance })
    // Get accounts.
    web3RPC.eth.getAccounts(function(error, accounts) {
      console.log(accounts)
      
      simpleStorage.deployed().then(function(instance) {
        simpleStorageInstance = instance
        simpleStorageInstance.addCharity("exampleCharity.com", 0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe, {from: accounts[0]})
      })


      simpleStorage.deployed().then(function(instance) {
        simpleStorageInstance = instance
        // Stores a value of 5.
        return simpleStorageInstance.set(5, {from: accounts[0]})
      }).then(function(result) {
        // Get the value from the contract to prove it worked.
        return simpleStorageInstance.get.call(accounts[0])
      }).then(function(result) {
        // Update state with the result.
        return self.setState({ storageValue: result.c[0] })
      })


      simpleStorage.deployed().then(function(instance) {
        simpleStorageInstance = instance

        return simpleStorageInstance.addressLink.call(accounts[0])
      }).then(function(result) {
        // Update state with the result.
        console.log(result);
        return self.setState({ address: result })
        
      })

      simpleStorage.deployed().then(function(instance) {
        simpleStorageInstance = instance

        return simpleStorageInstance.returnLink.call(accounts[0])
      }).then(function(result) {
        // Update state with the result.
        console.log(result);
        return self.setState({ charity: result })
        
      })
    })


  }

  render() {
    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
            <a href="#" className="pure-menu-heading pure-menu-link"><img width="25" height="25" src={logo}/> Given</a>
            {/*}<ul className="pure-menu-list">
                <li className="pure-menu-item"><a href="#" className="pure-menu-link">News</a></li>
                <li className="pure-menu-item"><a href="#" className="pure-menu-link">Sports</a></li>
                <li className="pure-menu-item"><a href="#" className="pure-menu-link">Finance</a></li>
            </ul>*/}
        </nav>

        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
                <p> An open source, simple charity contribution app intended 
                for charities to gather a pool of funds in ether.</p> 
              <h2>Charity Pool</h2>
              <p>Current Funds Raised: {this.state.balance}</p>
              <p>Charity Link: {this.state.charity}</p>
              <p>Address to donate: <br/> {this.state.address}</p>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App
