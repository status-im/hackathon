import React, { Component } from 'react';
import { connect } from 'react-redux'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import {sendTokenPayment} from '../actions'

class Pay extends Component {
  constructor(props) {
    super(props)

    this.setAmount = this.setAmount.bind(this)


    this.state = {
      payAmount: '',
      payRequiredWarn: false
    }
  }

  setAmount(e) {
    this.setState({
      ...this.state,
      payAmount: e.target.value,
      // tokenRequiredWarn: false
    })
  }

  render() {
    const {
      betIdInput,
      betDescription,
      descripRequiredWarn,
      idRequiredWarn,
      payAmount
    } = this.state
    const {
      curGroupId,
      dispatch,
      userAddresses,
      accountNum,
      peerCoinInstance,
      toAddr,
      fromAddr
    } = this.props
    let payButton = () => {
      // console.log(curGroupId)
      dispatch(
        // toAdr, groupId, amount, userAddresses, accountIndex
        sendTokenPayment(peerCoinInstance, toAddr, curGroupId, payAmount, userAddresses, accountNum)
      )
    }
    const PayGUI = () => (
      <div>
        <TextField
          floatingLabelText='Amount to Pay.'
          onChange={this.setAmount}
          errorText={idRequiredWarn? 'Bet ID is a required field' : '' }
          value={payAmount}
          fullWidth={true}
        />

        {/*<TextField
          floatingLabelText='Group ID - this will be used to uniquely identify the group.'
          onChange={groupIdInput}
        />*/}

        <RaisedButton onTouchTap={payButton} label='Make Payment' primary={true} fullWidth={true}/>
      </div>
    )
    return (
      <div className="Pay">
        <h1>Pay a friend.</h1>
        <p>Pay @{toAddr} from @{fromAddr} in the group @{curGroupId}.</p>
        {false? (<div>
          <h2>Please be patient</h2>
        </div>) : PayGUI()}
    </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    curGroupId: state.curGroupId,
    peerCoinInstance: state.peerCoinInstance,
    userAddresses: state.userAddresses,
    accountNum: state.accountNum,
    toAddr:state.toAddr,
    fromAddr:state.fromAddr
  }
}
export default connect(mapStateToProps)(Pay)
