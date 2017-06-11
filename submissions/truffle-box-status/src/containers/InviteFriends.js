import React, { Component } from 'react'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import { connect } from 'react-redux'
import { inviteUsers } from '../actions'

import {
  Table,
  TableBody,
  TableFooter,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

class InveteFriends extends Component {
  constructor(props) {
    super(props)

    this.selectFriends = this.selectFriends.bind(this)

    this.state = {
      invites: []
    }
  }
  selectFriends(invites) {
    console.log(this.state, invites)
    this.setState({
      ...this.state,
      invites
    })
  }
  render() {
    const {
      invites
    } = this.state
    const {
      screenContext,
      curGroupId,
      userAddresses,
      accountNum,
      peerCoinInstance
    } = this.props

    let inviteFriends = (invites) => {
      console.log(invites)
      console.log(curGroupId)
      this.props.dispatch(inviteUsers(peerCoinInstance, curGroupId, userAddresses, accountNum, invites))
    }

    // TODO: add a filter, don't show your own address.
    const friends = userAddresses.map((address, i) =>
            <TableRow key={i} selected={invites.indexOf(i) > -1} >
              <TableRowColumn>{i}</TableRowColumn>
              <TableRowColumn>{address}</TableRowColumn>
            </TableRow>
        )

    console.log('the screen context', screenContext)
    console.log('the screen context', userAddresses)
    return (
      <div className='InveteFriends'>
        <h1>Invite Friends</h1>
        {(screenContext === 'createdGroup') ? <p>You have just created a group, why not invite some friends to join, just enter their unique address.</p> : ''}
        <p>Invite friends to join your group: @{curGroupId}</p>
        <Table height='300px' onRowSelection={this.selectFriends} multiSelectable={true}>
          <TableHeader>
            <TableRow>
              <TableHeaderColumn tooltip="The Group ID">ID</TableHeaderColumn>
              <TableHeaderColumn tooltip="Friend Address">Friend Address</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody showRowHover={true}>
            {friends}
          </TableBody>
        </Table>
        <RaisedButton onTouchTap={() => inviteFriends(invites)} label='Invite Selected Friends' primary={true} fullWidth={true}/>
      </div>
    )
    // <RaisedButton onClick={() => inviteFriends(invites)} label='Invite Selected Friends' primary={true} fullWidth={true}/>
  }
}

const mapStateToProps = state => {
  return {
    screenContext: state.screenContext,
    curGroupId: state.curGroupId,
    peerCoinInstance: state.peerCoinInstance,
    accountNum: state.accountNum,
    userAddresses: state.userAddresses
   }
}

export default connect(mapStateToProps)(InveteFriends)
