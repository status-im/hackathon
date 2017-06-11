import React from 'react';
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import EthereumBridge from './EthereumBridge';
import Notifier from './Notifier';

var addressesDirectory = {
    "Creator": "0x67638EE841F555c996e4991F92696780FA95c444",
    "Burn": "0x0",
    "Empty": ""
}

var commitmentData = {
    goal:null,
    beneficiary:null,
    endTimestamp: null,
    amount: null,
}

var goalTextSuggestions = [
    "go to Mars",
    "learn to play ukulele",
    "make a Đapp",
    "run 100km",
    "close all my bank accounts",
    "setup a Monero node",
    "plant a tree",
    "ride an emu"
];

class Creator extends React.Component {

    constructor() {
        super();

        var defaultAddressKey = "Creator";
        this.state = {
            beneficiaryAddressKey: defaultAddressKey,
            beneficiaryAddress: addressesDirectory[defaultAddressKey],
            goalText:"",
            amountText: "",
            allGood: false
        };
    }

    onCreateCommitment = () =>
    {
        var that = this;
        EthereumBridge.createCommit(commitmentData).then(function(value)
        {
            Notifier.notify("Commitment successfully added!");
            Notifier.reloadFeed();

        }).catch(function(e){
            Notifier.notify("Transaction failed. Commitment not added.");
        });

        Notifier.notify("Waiting for block confirmation...");
        that.props.onCommitmentCreated();
    };

    onGoalTextChanged = (e, newValue) =>
    {
        if(newValue.length > 30 )
            return;

        commitmentData.goal = newValue;

        this.setState({
            goalText: newValue
        });

        this.checkIsAllGood();
    };

    onDateSelected = (e, date) =>
    {
        commitmentData.endTimestamp = date.getTime()/1000;
        this.checkIsAllGood();
    };

    onAmountTextChanged = (e, newValue) =>
    {
        if (isNaN(newValue))
            return;

        commitmentData.amount = newValue;

        this.setState({
            amountText:newValue
        });

        this.checkIsAllGood();
    };

    onAddressSelected = (event, index, value) =>
    {
        commitmentData.beneficiary = addressesDirectory[value];
        this.setState({
            beneficiaryAddressKey:value,
            beneficiaryAddress:addressesDirectory[value]
        });

        this.checkIsAllGood();
    };

    checkIsAllGood=()=>
    {
        var allGood = false;
        if(commitmentData.goal &&
            commitmentData.beneficiary &&
            commitmentData.endTimestamp &&
            commitmentData.amount)
        allGood = true;

        this.setState({
            allGood: allGood
        });
    }


  
  render() {

    return (
      <div>
        <p>
            I'm going to
        </p>

        <TextField
            hintText = {goalTextSuggestions[Math.floor(Math.random()*goalTextSuggestions.length)]}
            value = {this.state.goalText}
            onChange = {this.onGoalTextChanged} />
        <p>
            by the end of
        </p>

        <DatePicker
            minDate = {new Date(Date.now() + (24*60*60*1000))}
            hintText = "Select a date"
            onChange = {this.onDateSelected}
            autoOk = {true}/>

        <p>
            otherwise I will give away
        </p>

        <TextField
            hintText="Ether amount"
            value = {this.state.amountText}
            onChange = {this.onAmountTextChanged}/>

        <p>
            
        </p>

        <DropDownMenu value={this.state.beneficiaryAddressKey} onChange={this.onAddressSelected}>
          <MenuItem value="Creator" primaryText="To the creator of this Đapp" />
          <MenuItem value="Empty" primaryText="To a new address" />
          <MenuItem value="Burn" primaryText="Burn the money" />
        </DropDownMenu>

         <p>
            <TextField hintText="beneficiary address" value = {this.state.beneficiaryAddress} />
         </p>
        <p>
            
        </p>
        <RaisedButton
          label = "Let's get it done!"
          secondary = {true}
          onTouchTap = {this.onCreateCommitment}
          disabled = {!this.state.allGood}
        />       
      </div>
    );
  }
}

export default Creator;