import React, { Component } from 'react'
import { connect } from 'react-redux'
// import './App.css'
import SideBar from './containers/SideBar.js'
import BotInstructions from './components/BotInstructions.js'
import HowItWorks from './components/HowItWorks.js'
import CreateGroup from './containers/CreateGroup.js'
import Home from './containers/Home.js'
import MyGroups from './containers/MyGroups.js'
import MyBets from './containers/MyBets.js'
import CreateBet from './containers/CreateBet.js'
import ViewGroup from './containers/ViewGroup.js'
import InviteFriends from './containers/InviteFriends.js'
import CreateBetPosition from './containers/CreateBetPosition.js'
import SelectAccount from './containers/SelectAccount.js'
import Pay from './containers/Pay.js'
import EditBet from './containers/EditBet.js'
import Tokens from './containers/Tokens.js'
import {loadPeerCoinInstanceAndUserAddress, setScreen, setAccountNum} from './actions'
import PropTypes from 'prop-types'

class App extends Component {
  constructor(props) {
    super(props)
  }

  static propTypes = {
    peerCoinLoaded: PropTypes.bool,
    screen: PropTypes.number
  }

  componentWillMount() {
    let params = window.location.hash.substr(1).split('&');

    if (params.length > 1) {
      console.log('getting params')
      console.log(params)
      console.log(window.location.hash.substr(1))
      console.log('done')
      this.props.dispatch(
        setAccountNum(parseInt(params[1]))
      )
      this.props.dispatch(
        setScreen(parseInt(params[2]))
      )
    } else {
      setScreen(0)
      console.log('shouldnt show')
    }

    console.log(params)
    this.props.dispatch(
      loadPeerCoinInstanceAndUserAddress()
    )
  }

  render() {
    const displayMainWindow = () => {
      if (this.props.peerCoinLoaded) {
        if (this.props.accountIsSelected){
          console.log("you are on screen:", this.props.screen)
          if (this.props.screen == 0)
            return <Home />
          else if(this.props.screen == 1)
              return <HowItWorks />
          else if(this.props.screen == 2)
              return <MyGroups />
          else if (this.props.screen == 3)
            return <MyBets />
          else if(this.props.screen == 4)
            return <CreateGroup />
          else if(this.props.screen == 5)
              return <Tokens /> //TODO:: rename this to TokenInfo
          else if(this.props.screen == 6)
              return <BotInstructions />
          else if(this.props.screen == 7)
              return <InviteFriends />
          else if(this.props.screen == 8)
              return <CreateBet />
          else if(this.props.screen == 9)
              return <ViewGroup />
          else if(this.props.screen == 10)
              return <CreateBetPosition />
          else if(this.props.screen == 11)
              return <Pay />
          else if(this.props.screen == 12)
              return <EditBet />
        } else {
          return <SelectAccount />
        }
      } else {
        return (
          <p>Wating to sync to the contract on the network.</p>
        )
      }
    }
    return (
      // <a className={classNames({'side-button': true, 'left': true, 'active': this.state.side === 'left'})} onClick={this.changeSide.bind(this, 'left')}>Left</a>
      // <a className={classNames({'side-button': true, 'right': true, 'active': this.state.side === 'right'})} onClick={this.changeSide.bind(this, 'right')}>Right</a>
      <div id="outer-container" style={{height: '100%'}}>
        <SideBar/>
        <main id="page-wrap">
          {displayMainWindow()}
        </main>
      </div>
    )
    // {buttons}
    // <div id={ "outer-container" }>
    // <SideBar/>
    // <div id="page-wrap">
    // </div>
    // </div>
  }
}

const mapStateToProps = state => {
  return {
    screen: state.screen,
    peerCoinLoaded: state.peerCoinLoaded,
    accountIsSelected: state.accountIsSelected
   }
}

export default connect(mapStateToProps)(App)
