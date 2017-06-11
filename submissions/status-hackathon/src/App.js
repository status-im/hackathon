import React, { Component } from 'react'
/*
import SimpleStorageContract from '../build/contracts/SimpleStorage.json'
import Config from '../truffle.js'
import Web3 from 'web3'
*/
import { Navbar, Grid } from 'react-bootstrap';

import MainContainer from './containers/MainContainer'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      storageValue: 0
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
    /*
    var self = this

    var {host, port} = Config.networks[process.env.NODE_ENV]
    
    // Get the RPC provider and setup our SimpleStorage contract.
    const provider = new Web3.providers.HttpProvider('http://' + host + ':' + port)
    const contract = require('truffle-contract')
    const simpleStorage = contract(SimpleStorageContract)
    simpleStorage.setProvider(provider)

    // Get Web3 so we can get our accounts.
    const web3RPC = new Web3(provider)

    // Declaring this for later so we can chain functions on SimpleStorage.
    var simpleStorageInstance

    // Get accounts.
    web3RPC.eth.getAccounts(function(error, accounts) {
      console.log(accounts)

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
    })
     */
  }

  render() {
    return (
      <div className="App">
        <Navbar fluid collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand>
              <a href="#">Split the Tab!</a>
            </Navbar.Brand>
          </Navbar.Header>
        </Navbar>
        <Grid>
          <MainContainer/>
        </Grid>
      </div>
    );
  }
}

export default App
