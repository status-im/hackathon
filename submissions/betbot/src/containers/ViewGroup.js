import React, { Component } from 'react'
import {
  Table,
  TableBody,
  TableFooter,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table'
import { connect } from 'react-redux'
import RaisedButton from 'material-ui/RaisedButton'
import {loadGroupInvites, goToCreateBet, loadGroupsBets, loadGroupInfo, goToPaymentScreen} from '../actions'

class ViewGroup extends Component {
  constructor(props) {
    super(props)

    this.state= {
      errorMessage: ''
    }
  }
  componentWillMount () {
    this.props.dispatch(loadGroupsBets(this.props.peerCoinInstance, this.props.curGroupId))
    this.props.dispatch(loadGroupInfo(this.props.peerCoinInstance, this.props.curGroupId))
  }
  render() {
    const {
      curGroupId,
      groupMembers,
      openGroupBets,
      groupBetsInfo,
      dispatch,
      groupInfo,
      userAddresses,
      accountNum
    } = this.props
    const {
      errorMessage
    } = this.state
    const inviteFriendsBtn = () => {
      dispatch(loadGroupInvites(curGroupId, 'viewGroup'))
    }
    const createGroupBtn = () => {
      dispatch(goToCreateBet(curGroupId))
    }
    const payUser = (userRow) => {
      // const index = groupMembers.indexOf()
      if (groupMembers[userRow] === userAddresses[accountNum]) {
        this.setState({
          ...this.state,
          errorMessage: 'you cannot pay yourself...'
        })
      } else {
        dispatch(goToPaymentScreen(groupMembers[userRow], userAddresses[accountNum], curGroupId))
      }
    }
    const openGroupBetsRows = openGroupBets.map((id, i) =>
      <TableRow key={i} >
        <TableRowColumn>{id}</TableRowColumn>
        <TableRowColumn>{groupBetsInfo.for[i] + '/' + groupBetsInfo.against[i]}</TableRowColumn>
      </TableRow>
    )
    const groupMembersRows = groupMembers.map((id, i) =>
      <TableRow key={i} >
        <TableRowColumn>{id}</TableRowColumn>
        <TableRowColumn>{groupInfo.balance[i]}</TableRowColumn>
      </TableRow>
    )
    return (
      <div className="ViewGroup">
        <h1>View Group @{curGroupId}</h1>
        <RaisedButton onTouchTap={inviteFriendsBtn} label='Invite Friends' primary={true} fullWidth={true}/>
        <br />
        <br />
        <RaisedButton onTouchTap={createGroupBtn} label='Create Bet' primary={true} fullWidth={true}/>
        {/*table for active bets*/}
        <h3>Active Bets</h3>
        <Table onRowSelection={this.selectFriends}>
          <TableHeader displayRowCheckbox={false}>
            <TableRow>
              <TableHeaderColumn tooltip="The Bet ID">Bet ID</TableHeaderColumn>
              <TableHeaderColumn tooltip="The For/Against Odds">For/Against</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody showRowHover={true} displayRowCheckbox={false}>
            {openGroupBetsRows}
          </TableBody>
        </Table>
        {/*table for users groups*/}
        <h3>Group Members</h3>
        {(errorMessage === '')? '' : <p style={{color: 'red'}}>ERROR MESSAGE: you cannot pay yourself</p>}
        <Table height='300px' onCellClick={(row) => payUser(row)}>
          <TableHeader displayRowCheckbox={false}>
            <TableRow>
              <TableHeaderColumn tooltip="User Address">User</TableHeaderColumn>
              <TableHeaderColumn tooltip="Users Balance">Balance</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody showRowHover={true} displayRowCheckbox={false}>
            {groupMembersRows}
          </TableBody>
        </Table>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    curGroupId: state.curGroupId,
    groupMembers: state.groupMembers,
    openGroupBets: state.openGroupBets,
    groupBetsInfo: state.groupBetsInfo,
    peerCoinInstance: state.peerCoinInstance,
    groupInfo: state.groupInfo,
    userAddresses: state.userAddresses,
    accountNum: state.accountNum
   }
}
export default connect(mapStateToProps)(ViewGroup)
