pragma solidity ^0.4.0;

contract HelloWorldContract {

  string word = "Hello World";
  address issuer;

  function HelloWorldContract() {
      issuer = msg.sender;
  }

  modifier ifIssuer() {
      if(issuer != msg.sender) {
          throw;
      } else {
          _;
      }
  }

  function getword() constant returns(string) {
      return word;
  }
  function setword(string nw) returns(string) {
      if(issuer != msg.sender) {
          return "This is not the creator";
      }
      else {
          word = nw;
          return "OK";
      }
  }
}
