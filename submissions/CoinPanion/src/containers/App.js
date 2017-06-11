import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import NavBar from 'components/NavBar'
import About from 'components/About'
import Explore from 'components/Explore'
import EditProfile from 'containers/EditProfileWrapper'
import Dashboard from 'containers/DashboardWrapper'
import Profile from 'containers/ProfileWrapper'
import NoMatch from 'components/NoMatch'
import Web3InitContainer from './Web3InitContainer'

import * as profileActions from '../actions/profile'
import * as web3Actions from '../actions/web3'

import '../css/oswald.css'
import '../css/open-sans.css'
import '../css/pure-min.css'
import './App.css'

class App extends Component {
  componentDidMount() {
    setTimeout(() => {
      const web3 = this.props.web3Initialize()
      this.props.getVault(web3)
    }, 100)
  }

  // componentWillReceiveProps(nextProps) {
  //   if (this.props.web3.currentProvider.host !== nextProps.web3.currentProvider.host) {
  //     const web3 = nextProps.web3Initialize()
  //     nextProps.getVault(web3)
  //   }
  // }

  render() {
    return (
      <Router>
        <div className="App">
          <NavBar />
          <Web3InitContainer />
          <Switch>
            <Route exact path="/" component={Explore} />
            <Route path="/explore" component={Explore} />
            <Route path="/about" component={About} />
            <Route path="/editprofile" component={EditProfile} />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/profile/:id" component={Profile} />
            <Route component={NoMatch} />
          </Switch>
        </div>
      </Router>
    )
  }
}

function mapStateToProps(state) {
  return {
    web3: state.web3.web3Provider
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...profileActions, ...web3Actions }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
