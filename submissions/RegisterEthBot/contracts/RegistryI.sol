pragma solidity ^0.4.8;

contract RegistryI {
  function update(bytes32 _id, string _name, address _addr, string _proof);
  function error(bytes32 _id, address _addr, string _result, string _message);
}
