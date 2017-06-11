pragma solidity ^0.4.2;

contract SimpleStorage {
  uint storedData;
  address public creator;
  string charityLink;
  address public charityAddress;


  function SimpleStorage(){
    creator = msg.sender;
  }

  function set(uint x) {
    storedData = x;
  }

  function addCharity(string link, address charity) public {
    if(msg.sender == creator){
      charityLink = link;
      charityAddress = charity;
    }
  }

  function get() constant returns (uint) {
    return storedData;
  }

  function returnLink() constant returns (string){
    return charityLink;
  }

  function returnBalance() constant returns (uint){
    return charityAddress.balance;
  }

  //Returns contract address
  function addressLink() constant returns (address) {
    return charityAddress;
  }

  //write function to send funds in 7 days
}
