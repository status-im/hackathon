pragma solidity ^0.4.8;

contract RegistrarI {
  function register(string _proof, address _addr) payable returns(bytes32 oracleId);
  function getCost() constant returns (uint cost);
  //Below functions used for testing and internally
  function _register(bytes32 oracleId, address expectedAddress, string proof);
  function _callback(bytes32 _id, string _result);
  function _clearOracleId(bytes32 oracleId);
}
