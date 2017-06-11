import React, { Component } from 'react';
import { connect } from 'react-redux'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import {createBet} from '../actions'

class CreateBet extends Component {
  constructor(props) {
    super(props)

    this.setBetID = this.setBetID.bind(this)
    this.setBetDecscription = this.setBetDecscription.bind(this)


    this.state = {
      betIdInput: '',
      betDescription: '',
      descripRequiredWarn: false,
      idRequiredWarn: false
    }
  }

  setBetID(e) {
    this.setState({
      ...this.state,
      betIdInput: e.target.value,
      // tokenRequiredWarn: false
    })
  }
  setBetDecscription(e) {
    this.setState({
      ...this.state,
      betDescription: e.target.value,
      // tokenRequiredWarn: false
    })
  }

  render() {
    const {
      betIdInput,
      betDescription,
      descripRequiredWarn,
      idRequiredWarn
    } = this.state
    const {
      curGroupId,
      dispatch,
      userAddresses,
      accountNum,
      peerCoinInstance
    } = this.props
    // <TextField
    // floatingLabelText='Group ID - this will be used to uniquely identify the group.'
    // onChange={this.setGroupID}
    // value={groupIdInput}
    // errorText={idRequiredWarn? 'Token ID is a required field' : (isIdAvailable? '' : 'Sorry the ID ' + groupIdInput + ' is unavailable') }
    // fullWidth={true}
    // />
    let createBetButton = () => {
      let idRequiredWarn = false
      let descripRequiredWarn = false
      if (betIdInput === '') {
        idRequiredWarn = true
      }
      if (betDescription === '') {
        descripRequiredWarn = true
      }
      this.setState({
        ...this.state,
        idRequiredWarn,
        descripRequiredWarn
      })
      if (!(idRequiredWarn || descripRequiredWarn)){
        // TODO: ADD CHECK IF ID AVAILABLE FOR BET...
        // this.props.peerCoinInstance.isGroupIdUsed(groupIdInput).then(gidUnavailable => {
        //   if (!gidUnavailable) {
            this.props.dispatch(
              createBet(peerCoinInstance, betIdInput, curGroupId, betDescription, userAddresses, accountNum)
            )
        //   }
        // })
      } else {
        console.log('couldnt create group')
      }
    }
    const createBetGUI = () => (
      <div>
        <TextField
          floatingLabelText='Bet ID.'
          onChange={this.setBetID}
          errorText={idRequiredWarn? 'Bet ID is a required field' : '' }
          value={betIdInput}
          fullWidth={true}
        />
        <TextField
          floatingLabelText='Bet description.'
          onChange={this.setBetDecscription}
          errorText={descripRequiredWarn? 'Bet Description is a required field' : '' }
          value={betDescription}
          fullWidth={true}
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

        <RaisedButton onTouchTap={createBetButton} label='Create Bet' primary={true} fullWidth={true}/>
      </div>
    )
    return (
      <div className="CreateBet">
        <h1>Create New Bet</h1>
        <p>Create a group for @{curGroupId}</p>
        {false? (<div>
          <h2>Please be patient</h2>
        </div>) : createBetGUI()}
    </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    curGroupId: state.curGroupId,
    peerCoinInstance: state.peerCoinInstance,
    userAddresses: state.userAddresses,
    accountNum: state.accountNum
  }
}
export default connect(mapStateToProps)(CreateBet)
