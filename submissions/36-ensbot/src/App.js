import React, { Component } from 'react';
import { parse } from 'qs';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'
import './App.css';
import Loader from 'react-loader'
//import { ethRegistrar } from './ensutils'

import Check from './components/Check'
import Bid from './components/Bid'
import StartAuction from './components/StartAuction'
import StartAuctionAndBid from './components/StartAuctionAndBid'
import RevealBid from './components/RevealBid'

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

const Routes = () => {
  return <Router>
    <div>
      <Route exact path="/" component={App}/>
      <Route path="/check/" component={Check}/>
      <Route path="/startauction/" component={StartAuction}/>
      <Route path="/startauctionandbid/" component={StartAuctionAndBid}/>
      <Route path="/bid/" component={Bid}/>
      <Route path="/revealbid/" component={RevealBid}/>
    </div>
  </Router>
}

export default Routes;
