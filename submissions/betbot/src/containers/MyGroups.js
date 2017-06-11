import React, { Component } from 'react'
import {loadUsersGroups, loadGroupDetails, loadUsersInvites, accetpYourInvitation} from '../actions'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import {
  Table,
  TableBody,
  TableFooter,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'

class MyGroups extends Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    this.props.dispatch(
      loadUsersGroups(this.props.peerCoinInstance, this.props.userAddresses[this.props.accountNum])
    )
    this.props.dispatch(
      loadUsersInvites(this.props.peerCoinInstance, this.props.userAddresses[this.props.accountNum])
    )
  }

  render() {
    const {
      groupData,
      dispatch,
      peerCoinInstance,
      yourInvites,
      groupInvitesInfo,
      userAddresses,
      accountNum,
    } = this.props
    console.log('groupData!!!!', groupData)
    const groups = () => {
      if (this.props.groupDataLoaded){
        // TODO: fix the headings.
        // const {groupData: {groupIDs, groupNames, groupBalance}} = this.props.groupData
        return this.props.groupData.groupIDs.map((gID, i) =>
          <TableRow key={i}>
            <TableRowColumn>{gID}</TableRowColumn>
            <TableRowColumn>{this.props.groupData.groupNames[i]}</TableRowColumn>
            <TableRowColumn>{this.props.groupData.groupBalance[i]}</TableRowColumn>
          </TableRow>
        )
        // <TableRowColumn><RaisedButton label="View" primary={true} /></TableRowColumn>
      } else {
        return ''
      }
    }
    console.log(groupInvitesInfo, yourInvites, 'invite stuff...')
    const invites =  yourInvites.map((gID, i) =>
          <TableRow key={i}>
            <TableRowColumn>{gID}</TableRowColumn>
            <TableRowColumn>{groupInvitesInfo.invStatus[i]? 'pending': 'accepted'}</TableRowColumn>
            <TableRowColumn><RaisedButton label="Primary" primary={true} onTouchTap={() => dispatch(accetpYourInvitation(peerCoinInstance,gID,userAddresses[accountNum]))} /></TableRowColumn>
          </TableRow>
        )
    const loadGroupDetailsBtn = (groupIndex) => {
      const gid = groupData.groupIDs[groupIndex]
      console.log(gid, 'is the group id')
      dispatch(loadGroupDetails(peerCoinInstance, gid))
    }
    return (
      <div className="MyGroups">
        <h1>My Groups</h1>
        <p>The following are groups you belong to as well as group invites.</p>
        <div>
          <Table onCellClick={(row) => console.log(row)}>
            <TableHeader displayRowCheckbox={false}>
              <TableRow>
                <TableHeaderColumn tooltip="Group Name">Group Name</TableHeaderColumn>
                <TableHeaderColumn tooltip="The Status">Status</TableHeaderColumn>
                <TableHeaderColumn tooltip="The Action you can perform on this group.">Action</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody showRowHover={true} displayRowCheckbox={false}>
              {invites}
            </TableBody>
          </Table>
          <Table height='300px' onCellClick={(row) => loadGroupDetailsBtn(row)}>
            <TableHeader displayRowCheckbox={false}>
              <TableRow>
                <TableHeaderColumn tooltip="The Group ID">ID</TableHeaderColumn>
                <TableHeaderColumn tooltip="The Name">Name</TableHeaderColumn>
                <TableHeaderColumn tooltip="Your Balance in Group">Balance (in mili tokens)</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody showRowHover={true} displayRowCheckbox={false}>
              {groups()}
            </TableBody>
          </Table>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    screen: state.screen,
    peerCoinLoaded: state.peerCoinLoaded,
    peerCoinInstance: state.peerCoinInstance,
    groupDataLoaded: state.groupDataLoaded,
    userAddresses: state.userAddresses,
    accountNum: state.accountNum,
    yourInvites: state.yourInvites,
    groupInvitesInfo: state.groupInvitesInfo,
    groupData: state.groupData,
    accountNum: state.accountNum,
    userAddresses: state.userAddresses
   }
}

export default connect(mapStateToProps)(MyGroups)
