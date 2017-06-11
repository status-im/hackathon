import React, { Component } from 'react'
import {loadUsersBets} from '../actions'
import {
  Table,
  TableBody,
  TableFooter,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import { connect } from 'react-redux'

class MyBets extends Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    this.props.dispatch(
      loadUsersBets(this.props.peerCoinInstance, this.props.userAddresses[this.props.accountNum])
    )
  }

  render() {
    const {
      dispatch,
      peerCoinInstance,
      openBets,
      openBetsInfo
    } = this.props
    const youBetsRows = openBets.map((bID, i) =>
      (<TableRow key={i}>
        <TableRowColumn>{bID}</TableRowColumn>
        <TableRowColumn>{bID}</TableRowColumn>
        <TableRowColumn>{openBetsInfo.positions[i]? 'for':'against'}</TableRowColumn>
        <TableRowColumn>{openBetsInfo.amount[i]}</TableRowColumn>
      </TableRow>)
    )
    console.log(openBetsInfo,openBets, 'open bets info')
    const loadBetDetailsBtn = (groupIndex) => {
      // const gid = groupData.groupIDs[groupIndex]
      console.log(groupIndex, 'was clicked')
      // dispatch(loadGroupDetails(peerCoinInstance, gid))
    }
    return (
      <div className="MyBets">
        <h1>My Bets</h1>
        <p>The following are groups you belong to as well as group invites.</p>
        <div>
          <Table height='300px' onCellClick={(row) => loadBetDetailsBtn(row)}>
            <TableHeader>
              <TableRow>
              <TableHeaderColumn tooltip="The Group ID">Group ID</TableHeaderColumn>
                <TableHeaderColumn tooltip="The Bets Name">Bet Name</TableHeaderColumn>
                <TableHeaderColumn tooltip="Your Position on the Bet">for/against</TableHeaderColumn>
                <TableHeaderColumn tooltip="Amount at Stake">Amount</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody showRowHover={true} displayRowCheckbox={false}>
              {youBetsRows}
            </TableBody>
          </Table>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    peerCoinInstance: state.peerCoinInstance,
    userAddresses: state.userAddresses,
    accountNum: state.accountNum,
    openBetsInfo: state.openBetsInfo,
    openBets: state.openBets
   }
}
export default connect(mapStateToProps)(MyBets)
