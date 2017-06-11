pragma solidity ^0.4.2;

contract BootcampProject {

    address owner;

    struct Challenge {
        //address user;
        uint remainingSupply;
        uint remainingUnits;
        string name;
    }

    struct Account {
        uint256 nbOfChallenges;
        mapping (uint256 => Challenge) challenges;
    }

    mapping (address => Account) accounts;

    /* Constructor */
    function BootcampProject() {
        owner = msg.sender;
    }

    /* Create new challenge */
    function NewChallenge(uint256 nbOfSessions, string name) payable {
        uint256 temp = accounts[msg.sender].nbOfChallenges;
        accounts[msg.sender].nbOfChallenges = temp+1;
        accounts[msg.sender].challenges[temp+1] = Challenge(msg.value,nbOfSessions,name);
    }

    /* Validate new session */
    function ValidateNewSession(uint256 challengeId) {
        uint rs = accounts[msg.sender].challenges[challengeId].remainingSupply;
        uint ru = accounts[msg.sender].challenges[challengeId].remainingUnits;
        if(ru == 0) {
            throw;
        } else if (ru == 1) {
            accounts[msg.sender].challenges[challengeId].remainingSupply = 0;
            accounts[msg.sender].challenges[challengeId].remainingUnits = 0;
            msg.sender.transfer(rs);
        } else {
            uint temp = uint(rs/ru);
            accounts[msg.sender].challenges[challengeId].remainingSupply = rs - temp;
            accounts[msg.sender].challenges[challengeId].remainingUnits = ru - 1;
            msg.sender.transfer(temp);
        }
    }

    /* Return number of current challenges */
    function NbOfChallenges() constant returns(uint) {
        return accounts[msg.sender].nbOfChallenges;
    }

    /* View State of my Challenge */
    function ViewState(uint256 challengeId) constant returns (uint[2]) {
        uint rs = accounts[msg.sender].challenges[challengeId].remainingSupply;
        uint ru = accounts[msg.sender].challenges[challengeId].remainingUnits;
        return [rs,ru];
    }
    function getName(uint256 challengeId) constant returns(string) {
    string name = accounts[msg.sender].challenges[challengeId].name;
    return name;
}
}
