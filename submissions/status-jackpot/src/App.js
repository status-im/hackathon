import React, { Component } from 'react'
import StatusJackpotContract from '../build/contracts/StatusJackpot.json'
import Config from '../truffle.js'
import Web3 from 'web3' 
import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

//#### Jackpot Container
class JackpotContainer extends Component {
  constructor(props) {
    super(props)

    this.state = {
      pooled: 0,
      yourbet: 0,
      winning: "",
      winner: "",
      first: "",
      pointer: 0,
      totalFinney: 0,
      hasEnded: 0,
      coinbase: ""
    }

    this._getAccountBalances = this._getAccountBalances.bind(this)
  }

  _getAccountBalances () {
    var self = this
    var {host, port} = Config.networks[process.env.NODE_ENV]

    const provider = new Web3.providers.HttpProvider('http://' + host + ':' + port)
    const contract = require('truffle-contract')
    const StatusJackpot = contract(StatusJackpotContract)
    StatusJackpot.setProvider(provider)
    const web3RPC = new Web3(provider)

    var sjp = StatusJackpot.deployed()
    var StatusJackpotInstance
    sjp = StatusJackpot.deployed();

    web3RPC.eth.getAccounts(function(err, accs) {
      this.setState({coinbase: accs[0]})

      StatusJackpot.deployed().then(function(instance) {
        return instance.getPooledAmount.call()
      }).then(function(result) {
        return self.setState({ pooled: web3RPC.fromWei(result.valueOf(), "ether") })
      })

      StatusJackpot.deployed().then(function(instance) {
        return instance.getBetAmount.call(accs[0])
      }).then(function(result) {
        return self.setState({ yourbet: web3RPC.fromWei(result.valueOf(), "ether") })
      })

      StatusJackpot.deployed().then(function(instance) {
        return instance.getWinning.call(accs[0])
      }).then(function(result) {
        if(result[0] == "bet"){
          self.setState({winning: result[1] + " blocks to go."});
        }else if(result[0] == "last"){
          self.setState({winning: "Accepting one more last bet!"});
        }else if(result[0] == "lost"){
          self.setState({winning: "You lost..."});
        }else if(result[0] == "won"){
          self.setState({winning: "You won: " + result[1].valueOf() + " ETH!" })
        }else{
          self.setState({winning: "Error"});
        }
      })

      //StatusJackpot.deployed().then(function(instance) {
      //  StatusJackpotInstance = instance
      //  return StatusJackpotInstance.get.call()
      //}).then(function(result) {
      //  return self.setState({ pong: result.c[0] })
      //})

      // Debug:
      StatusJackpot.deployed().then(function(instance) {
        return instance.getWinnerAddr.call()
      }).then(function(result) {
        return self.setState({ winner: result })
      })
      StatusJackpot.deployed().then(function(instance) {
        return instance.getPointer.call()
      }).then(function(result) {
        return self.setState({ pointer: result.toNumber() })
      })
      StatusJackpot.deployed().then(function(instance) {
        return instance.getJackpotEnded.call()
      }).then(function(result) {
        return self.setState({ isEnded: result.toNumber() })
      })
      StatusJackpot.deployed().then(function(instance) {
        return instance.getTotalFinney.call()
      }).then(function(result) {
        return self.setState({ totalFinney: result.toNumber() })
      })

    }.bind(this))
  }

  componentWillMount() {
    const refreshBalances = () => {
      this._getAccountBalances()
    }

    refreshBalances()

    setInterval(()=>{
      refreshBalances();
      return refreshBalances
    }, 5000)
  }

  render() {
    return (
      <div>
        <table>
          <thead>
            <tr><td>Jackpot Amount:</td></tr>
          </thead>
          <tbody>
            <tr key="jackpot"><td>{Math.floor(this.state.pooled * 100 ) / 100} ETH</td></tr>
          </tbody>
        </table>
        <table>
          <thead>
            <tr><td>Your Total Bet:</td></tr>
          </thead>
          <tbody>
            <tr key="yourbet"><td>{Math.floor(this.state.yourbet * 100 ) / 100} ETH</td></tr>
          </tbody>
        </table>
        <table>
          <thead>
            <tr><td>Winning:</td></tr>
          </thead>
          <tbody>
            <tr key="winning"><td>{this.state.winning} </td></tr>
          </tbody>
        </table>
        <table>
          <thead>
            <tr><td>Debug:</td></tr>
          </thead>
          <tbody>
            <tr key="pointer"><td>{"F:" + this.state.totalFinney + ", P:" + this.state.pointer + ", E:" + this.state.isEnded} </td></tr>
          </tbody>
        </table>
      </div>
    )
  }
}

//#### AccountList Container
class AccountListContainer extends Component {
  constructor(props) {
    super(props)

    this.state = {
      coinbase: "",
      balance: 0 
    }

    this._getAccountBalances = this._getAccountBalances.bind(this)
  }

  _getAccountBalances () {
    var {host, port} = Config.networks[process.env.NODE_ENV]

    const provider = new Web3.providers.HttpProvider('http://' + host + ':' + port)
    const web3RPC = new Web3(provider)

    web3RPC.eth.getAccounts(function(err, accs) {
      this.setState({coinbase: accs[0]})

      web3RPC.eth.getBalance(accs[0], (err, value) => {
        this.setState({balance: web3RPC.fromWei(value.toNumber(), 'ether')});
      });
    }.bind(this))
  }

  componentWillMount() {
    const refreshBalances = () => {
      this._getAccountBalances()
    }
    
    refreshBalances()
    
    setInterval(()=>{
      refreshBalances();
      return refreshBalances
    }, 5000)
  }

  render() {
    return (
      <div>
        <table>
          <thead>
            <tr><td>Your Balance:</td></tr>
          </thead>
          <tbody>
            <tr key="balance"><td>{Math.floor(this.state.balance * 100 ) / 100} ETH</td></tr>
          </tbody>
        </table>
        <SendCoin />
      </div>
    )
  }

}

//## SendCoin
class SendCoin extends Component {
  constructor(props) {
    super(props)

    this.state = {
      count: "",
      contAddr: "" 
    }

    this.handleBet = this.handleBet.bind(this)
  }

  handleBet(e) {
    var self = this
    var {host, port} = Config.networks[process.env.NODE_ENV]

    e.preventDefault()
    console.log('Init');

    const provider = new Web3.providers.HttpProvider('http://' + host + ':' + port)
    const contract = require('truffle-contract')
    const StatusJackpot = contract(StatusJackpotContract)
    StatusJackpot.setProvider(provider)
    const web3RPC = new Web3(provider)

    var StatusJackpotInstance


    web3RPC.eth.getAccounts(function(err, accs) {
      StatusJackpot.deployed().then(function(instance) {
        var data = {
          from: accs[0],
          to: instance.address.toString(),
          value: web3RPC.toWei(self.betAmountInput.value, "ether"),
          gas: 1000000
        };

        //web3RPC.eth.sendTransaction(data).then(function(err,txid) {
        //  console.log(txid)
        //}).catch(function (err) {
        //  console.log(err)
        //});

        instance.sendTransaction(data).then(function(result) {
          console.log(result)
        });

        //instance.send(web3RPC.toWei(1, "ether")).then(function(result) {
        //  console.log(result)
        //});
      })
    });

    console.log("Sent Ether...");
  }

  render() {
    return (
      <form className='SendCoin'>
        <input id='bet_amount' className='BetAmount' type='text' ref={(i) => { if(i) { this.betAmountInput = i}}} />
        <button className='BetBtn' onClick={this.handleBet}>Bet</button>
      </form>
    )
  }
}

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
    //var self = this

    // Get the RPC provider and setup our SimpleStorage contract.
    //var {host, port} = Config.networks[process.env.NODE_ENV]
    
    //const provider = new Web3.providers.HttpProvider('http://' + host + ':' + port)
    //const contract = require('truffle-contract')
    //const simpleStorage = contract(SimpleStorageContract)
    //simpleStorage.setProvider(provider)

    // Get Web3 so we can get our accounts.
    //const web3RPC = new Web3(provider)

    // Declaring this for later so we can chain functions on SimpleStorage.
    //var simpleStorageInstance

    // Get accounts.
    //web3RPC.eth.getAccounts(function(error, accounts) {
    //  console.log(accounts)

    //  simpleStorage.deployed().then(function(instance) {
    //    simpleStorageInstance = instance

    //    // Stores a value of 5.
    //    return simpleStorageInstance.set(5, {from: accounts[0]})
    //  }).then(function(result) {
    //    // Get the value from the contract to prove it worked.
    //    return simpleStorageInstance.get.call(accounts[0])
    //  }).then(function(result) {
    //    // Update state with the result.
    //    //return self.setState({ storageValue: result.c[0] })

    //    result = web3RPC.eth.getBalance(accounts[0])
    //    return self.setState({ storageValue: result.c[0] })
    //  })
    //})
  }

  render() {
    return (
      <div className="App">
        <JackpotContainer />
        <AccountListContainer />
      </div>
    );
  }
}

export default App
