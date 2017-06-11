import React, { Component } from 'react';
import { connect } from 'react-redux'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import Toggle from 'material-ui/Toggle'
import {createBetPos} from '../actions'

class CreateBetPosition extends Component {
  constructor(props) {
    super(props)

    this.setBetPosition = this.setBetPosition.bind(this)

    this.state = {
      betForAgainst: false,
      descripRequiredWarn: false,
      idRequiredWarn: false
    }
  }

  setBetPosition(event, position) {
    this.setState({
      ...this.state,
      betForAgainst: position
      // tokenRequiredWarn: false
    })
  }

  render() {
    const {
      betForAgainst,
      descripRequiredWarn,
      idRequiredWarn
    } = this.state
    const {
      curGroupId,
      dispatch,
      userAddresses,
      accountNum,
      peerCoinInstance,
      curBid,
      betDescription
    } = this.props

    let CreateBetPositionButton = () => {
      console.log('cerate bet position, ', curBid, curGroupId, betForAgainst, userAddresses, accountNum)
      this.props.dispatch(
        createBetPos(peerCoinInstance, curBid, curGroupId, betDescription, userAddresses, accountNum)
      )
    }
    const styles = {
      thumbSwitched: {
        backgroundColor: 'red',
      },
      trackSwitched: {
        backgroundColor: '#ff9d9d',
      },
      labelStyle: {
        color: 'red',
      }
    };
    const CreateBetPositionGUI = () => (
      <div>
        <h3>Your possiton is {betForAgainst? 'AGAINST':'FOR'}</h3>
        <Toggle
          label={betForAgainst? 'AGAINST':'FOR'}
          toggled={betForAgainst}
          labelPosition='right'
          thumbStyle={styles.thumbOff}
          trackStyle={styles.trackOff}
          thumbSwitchedStyle={styles.thumbSwitched}
          trackSwitchedStyle={styles.trackSwitched}
          labelStyle={styles.labelStyle}
          onToggle={((a,b) => this.setBetPosition(a, b))}
        />
        <TextField
          floatingLabelText='Amount (hardcoded to 1 token for this alpha)'
          value={1}
          fullWidth={true}
        />
        {/*<TextField
          floatingLabelText='Group ID - this will be used to uniquely identify the group.'
          onChange={groupIdInput}
        />*/}

        <RaisedButton onTouchTap={CreateBetPositionButton} label='Set bet position' primary={true} fullWidth={true}/>
      </div>
    )
    return (
      <div className="CreateBetPosition">
        <h1>Position</h1>
        <p>State your position in this Bet. This bet is in group @{curGroupId} with bet id @{curBid}</p>
        <p>Bet statement: <b>"{betDescription}"</b></p>
        {false? (<div>
          <h2>Please be patient</h2>
        </div>) : CreateBetPositionGUI()}
    </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    curGroupId: state.curGroupId,
    curBid: state.curBid,
    peerCoinInstance: state.peerCoinInstance,
    userAddresses: state.userAddresses,
    accountNum: state.accountNum,
    betDescription: state.betDescription
  }
}
export default connect(mapStateToProps)(CreateBetPosition)
