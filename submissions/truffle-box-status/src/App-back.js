import React, { Component } from 'react'
import SimpleStorageContract from '../build/contracts/SimpleStorage.json'
import UserContract from '../build/contracts/User.json'
import PeopleContract from '../build/contracts/People.json'
import Web3 from 'web3'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)

    this.setInputValue = this.setInputValue.bind(this)
    this.setValueOnChain = this.setValueOnChain.bind(this)
    this.addPersonToBC = this.addPersonToBC.bind(this)
    this.getPeopleFromBC = this.getPeopleFromBC.bind(this)
    this.setFirstName = this.setFirstName.bind(this)
    this.setLastName = this.setLastName.bind(this)
    this.setAge = this.setAge.bind(this)

    this.state = {
      storageValue: 0,
      inputValue: 0,
      firstNames: [],
      lastNames: [],
      ages: [],
      input: {
        firstName: '',
        lastName: '',
        age: 0
      }
    }
  }

  componentWillMount() {
    this.getPeopleFromBC()
  }

  setValueOnChain() {
    let self = this

    // Get the RPC provider and setup our SimpleStorage contract.
    const provider = window.web3.currentProvider
    // const provider = new Web3.providers.HttpProvider('http://localhost:8545')
    const contract = require('truffle-contract')
    const simpleStorage = contract(SimpleStorageContract)
    simpleStorage.setProvider(provider)

    // Get Web3 so we can get our accounts.
    const web3RPC = new Web3(provider)

    var simpleStorageInstance

    // Get accounts.
    web3RPC.eth.getAccounts(function(error, accounts) {
      console.log(accounts)

      simpleStorage.deployed().then(function(instance) {
        simpleStorageInstance = instance

        // Stores a value of 5.
        return simpleStorageInstance.set(self.state.inputValue, {from: accounts[0]})
      }).then(function(result) {
        // Get the value from the contract to prove it worked.
        return simpleStorageInstance.get.call(accounts[0])
      }).then(function(result) {
        // Update state with the result.
        return self.setState({ storageValue: result.c[0] })
      })
    })
    console.log('after function')
  }
  addPersonToBC() {

    let self = this

    // Get the RPC provider and setup our SimpleStorage contract.
    const provider = window.web3.currentProvider
    // const provider = new Web3.providers.HttpProvider('http://localhost:8545')
    const contract = require('truffle-contract')
    const people = contract(PeopleContract)
    people.setProvider(provider)

    // Get Web3 so we can get our accounts.
    const web3RPC = new Web3(provider)

    var peopleInstance

    // Get accounts.
    web3RPC.eth.getAccounts(function(error, accounts) {
      people.deployed().then(function(instance) {
        peopleInstance = instance

        return peopleInstance.addPerson(self.state.input.firstName, self.state.input.lastName, self.state.input.age, {from: accounts[0]})
      }).then(function(a) {
        peopleInstance.getPeople().then(function(result) {
          self.setState(
            {
              ...self.state,
              firstNames: result[0].map(i => window.web3.toAscii(i)),
              lastNames: result[1].map(i => window.web3.toAscii(i)),
              ages: String(result[2]).split(',') // this is a bit of a hack to get an array of int strings from bigints
            }
          )
        })
      })
    })
  }
  getPeopleFromBC() {
    let self = this

    const provider = window.web3.currentProvider
    const contract = require('truffle-contract')
    const people = contract(PeopleContract)
    people.setProvider(provider)

    const web3RPC = new Web3(provider)

    var peopleInstance

    people.deployed().then(function(instance) {
      instance.getPeople().then(function(result) {
        self.setState(
          {
            ...self.state,
            firstNames: result[0].map(i => window.web3.toAscii(i)),
            lastNames: result[1].map(i => window.web3.toAscii(i)),
            ages: String(result[2]).split(',') // this is a bit of a hack to get an array of int strings from bigints
          }
        )
      })
    })
  }
  userButton() {
    var self = this

    // Get the RPC provider and setup our SimpleStorage contract.
    const provider = window.web3.currentProvider
    // const provider = new Web3.providers.HttpProvider('http://localhost:8545')
    const contract = require('truffle-contract')
    const user = contract(UserContract)
    user.setProvider(provider)

    // Get Web3 so we can get our accounts.
    const web3RPC = new Web3(provider)

    var simpleStorageInstance
    user.deployed().then(function(instance) {
      simpleStorageInstance = instance

      instance.userName().then(i => console.log(i))
    })
  }

  setInputValue(e) {
    this.setState({
      ...this.state,
      inputValue: e.target.value
    })
  }

  setFirstName(e) {
    this.setState({
      ...this.state,
      input: {
        ...this.state.input,
        firstName: e.target.value
      }
    })
  }
  setFirstName(e) {
    this.setState({
      ...this.state,
      input: {
        ...this.state.input,
        firstName: e.target.value
      }
    })
  }
  setLastName(e) {
    this.setState({
      ...this.state,
      input: {
        ...this.state.input,
        lastName: e.target.value
      }
    })
  }
  setAge(e) {
    this.setState({
      ...this.state,
      input: {
        ...this.state.input,
        age: e.target.value
      }
    })
  }

  render() {
    const people = this.state.firstNames.map((fName, i) =>
      <tr key={i}>
        <td>{fName}</td>
        <td>{this.state.lastNames[i]}</td>
        <td>{this.state.ages[i]}</td>
      </tr>
    )
    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
            <a href="#" className="pure-menu-heading pure-menu-link">Truffle Box</a>
        </nav>

        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <h1>Good to Go!</h1>
              <p>The stored (in the ethereum blockchain) value is: {this.state.storageValue}</p>
              <p>The box (below) value is: {this.state.inputValue}</p>
            </div>
            <input value={this.state.inputValue} type="number" onChange={this.setInputValue}/>
          </div>
        </main>
        <button onClick={this.setValueOnChain}>Set in Blockchain</button>
        <button onClick={this.userButton}>Set in Blockchain</button>
        <div>
          <h1>A people list test:</h1>
          <p>Add a person to the list:</p>
          <input value={this.state.input.firstName} onChange={this.setFirstName}/>
          <input value={this.state.input.lastName} onChange={this.setLastName}/>
          <input value={this.state.input.age} type='number' onChange={this.setAge}/>
          <button onClick={this.addPersonToBC}>Add person to blockchain</button>
          <table>
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Age</th>
              </tr>
            </thead>
            <tbody>
              {people}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default App
