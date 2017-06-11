import React, { Component } from 'react'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import { connect } from 'react-redux'
import {createGroup} from '../actions'

class CreateGroup extends Component {
  constructor(props) {
    super(props)

    this.setGroupName = this.setGroupName.bind(this)
    this.setGroupID = this.setGroupID.bind(this)
    this.setTokenName = this.setTokenName.bind(this)
    this.setTokenSymbol = this.setTokenSymbol.bind(this)

    this.state = {
      groupNameInput: '',
      groupIdInput: '',
      tokenName: '',
      tokenSymbol: '',
      isIdAvailable: true,
      nameRequiredWarn: false,
      idRequiredWarn: false,
      tokenRequiredWarn: false
    }
  }

  setGroupName(e) {
    const changeId = (this.state.groupNameInput === this.state.groupIdInput)
    const newGroupId = changeId? e.target.value : this.state.groupIdInput
    this.setState({
      ...this.state,
      groupNameInput: e.target.value,
      groupIdInput: newGroupId,
      isIdAvailable: changeId? true : this.state.isIdAvailable, // if the ID doesn't change don't change this
      nameRequiredWarn: false,
      idRequiredWarn: changeId? false : this.state.idRequiredWarn //TODO:: (silly edge case bug here...)changeId? this.state.idRequiredWarn : false
    })
    if (changeId) {
      this.props.peerCoinInstance.isGroupIdUsed(newGroupId).then(result => {
        this.setState({
          ...this.state,
          isIdAvailable: !result,
        })
      })
    }
  }
  setGroupID(e) {
    this.setState({
      ...this.state,
      groupIdInput: e.target.value,
      isIdAvailable: true,
      idRequiredWarn: false
    })
    this.props.peerCoinInstance.isGroupIdUsed(e.target.value).then(result => {
      console.log('is the id available?', result)
      this.setState({
        ...this.state,
        isIdAvailable: !result,
        idRequiredWarn: false
      })
    })
  }
  setTokenName(e) {
    this.setState({
      ...this.state,
      tokenName: e.target.value,
      tokenRequiredWarn: false
    })
  }
  setTokenSymbol(e) {
    this.setState({
      ...this.state,
      tokenSymbol: e.target.value
    })
  }
  render() {
    const {
      groupNameInput,
      groupIdInput,
      tokenName,
      tokenSymbol,
      isIdAvailable,
      nameRequiredWarn,
      idRequiredWarn,
      tokenRequiredWarn
    } = this.state
    const {
      userAddresses,
      peerCoinInstance,
      busyCreatingGroup,
      accountNum
    } = this.props
    let createGroupButton = () => {
      console.log('create group internal funcion call')
      let nameRequiredWarn = false
      let idRequiredWarn = false
      let tokenRequiredWarn = false
      if (groupNameInput === '') {
        nameRequiredWarn = true
      }
      if (groupIdInput === '') {
        idRequiredWarn = true
      }
      if (tokenName === '') {
        tokenRequiredWarn = true
      }
      this.setState({
        ...this.state,
        idRequiredWarn,
        tokenRequiredWarn,
        nameRequiredWarn
      })
      if (!(nameRequiredWarn || idRequiredWarn || tokenRequiredWarn)){
        console.log('met conditions: creating group')
        this.props.peerCoinInstance.isGroupIdUsed(groupIdInput).then(gidUnavailable => {
          if (!gidUnavailable) {
            console.log('met conditions: creating group')
            console.log(groupNameInput, groupIdInput, tokenName, userAddresses, accountNum)
            this.props.dispatch(
              createGroup(peerCoinInstance, groupNameInput, groupIdInput, tokenName, userAddresses, accountNum)
            )
          }
        })
      } else {
        console.log('couldnt create group')
      }
    }
    const createGroupGUI = () => (
      <div>
        <h1>CreateGroup New</h1>
        <TextField
          floatingLabelText='Group Name'
          onChange={this.setGroupName}
          value={groupNameInput}
          errorText={nameRequiredWarn? 'Group Name is a required field.' : ''}
          fullWidth={true}
        />

        <TextField
          floatingLabelText='Group ID - this will be used to uniquely identify the group.'
          onChange={this.setGroupID}
          value={groupIdInput}
          errorText={idRequiredWarn? 'Token ID is a required field' : (isIdAvailable? '' : 'Sorry the ID ' + groupIdInput + ' is unavailable') }
          fullWidth={true}
        />

        <TextField
          floatingLabelText='Token Name'
          onChange={this.setTokenName}
          value={tokenName}
          errorText={tokenRequiredWarn?  'Token Name is a required field.' : ''}
          fullWidth={true}
        />

        {/*<TextField
          floatingLabelText='Group ID - this will be used to uniquely identify the group.'
          onChange={groupIdInput}
        />*/}

        <RaisedButton onClick={createGroupButton} label='Create Group' primary={true} fullWidth={true}/>
      </div>
    )
    return (
      <div className='CreateGroup'>
        {busyCreatingGroup? (<div>
          <h1>Creating Group</h1>
          <h2>Please be patient</h2>
        </div>) : createGroupGUI()}
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
    groupData: state.groupData,
    userAddresses: state.userAddresses,
    busyCreatingGroup: state.busyCreatingGroup,
    accountNum: state.accountNum
   }
}

export default connect(mapStateToProps)(CreateGroup)
