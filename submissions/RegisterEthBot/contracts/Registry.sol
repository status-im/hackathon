pragma solidity ^0.4.8;

import "../installed_contracts/oraclize/contracts/usingOraclize.sol";
import '../installed_contracts/zeppelin/contracts/ownership/Ownable.sol';

import "./RegistryI.sol";
import "./RegistrarI.sol";

contract Registry is RegistryI, Ownable {

  //Initialization events
  event RegistrarUpdated(address indexed _addr, string _registrarName, address _registrar, uint8 _registrarType);

  //Success events
  event RegistrationSent(address indexed _addr, string _proof, bytes32 _id, uint8 _registrarType);
  event NameAddressProofRegistered(address indexed _addr, string _name, string _proof, bytes32 _id, uint8 _registrarType);

  //Error events
  event RegistrarError(address indexed _addr, bytes32 _id, string _result, uint8 _registrarType, string _message);
  event AddressMismatch(address indexed _addr, address _mismatchedAddr, uint8 _registrarType, string _message);
  event InsufficientFunds(address indexed _addr, uint _funds, uint _cost, uint8 _registrarType, string _message);

  string[] public registrarTypes;
  string[] public registrarDetails;
  RegistrarI[] public registrars;

  mapping (uint8 => mapping (address => string)) addrToName;
  mapping (uint8 => mapping (string => address)) nameToAddr;
  mapping (uint8 => mapping (address => string)) addrToProof;
  mapping (uint8 => mapping (string => string)) nameToProof;
  mapping (bytes32 => uint8) registrarIdToType;

  modifier onlyRegistrar {
    bool isRegistrar = false;
    for (uint i = 0; i < registrarTypes.length; i++) {
      if (msg.sender == address(registrars[i])) {
        isRegistrar = true;
      }
    }
    if (!isRegistrar) throw;
    _;
  }

  modifier validRegistrar(uint8 _registrarIndex) {
    if (_registrarIndex >= registrarTypes.length) {
      throw;
    }
    _;
  }

  function createRegistrar(string _registrarType, string _registrarDetail, address _registrar) public onlyOwner {
    registrars.push(RegistrarI(_registrar));
    registrarTypes.push(_registrarType);
    registrarDetails.push(_registrarDetail);
    RegistrarUpdated(msg.sender, _registrarType, _registrar, uint8(registrars.length) - 1);
  }

  function lookupAddr(address _addr, uint8 _registrarType) public constant validRegistrar(_registrarType) returns(string name, string proof) {
    return (addrToName[_registrarType][_addr], addrToProof[_registrarType][_addr]);
  }

  function lookupName(string _name, uint8 _registrarType) public constant validRegistrar(_registrarType) returns(address addr, string proof) {
    return (nameToAddr[_registrarType][_name], nameToProof[_registrarType][_name]);
  }

  function register(string _proof, address _addr, uint8 _registrarType) public payable validRegistrar(_registrarType) returns(bytes32 oracleId) {

      //_addr not strictly needed - but we use it to do an upfront check to avoid wasted oracle queries
      if (msg.sender != _addr) {
        AddressMismatch(msg.sender, _addr, _registrarType, "Sending address does not match supplied address!");
        return;
      }

      uint cost = registrars[_registrarType].getCost();
      if (cost > this.balance) {
        InsufficientFunds(_addr, this.balance, cost, _registrarType, "Insufficient funds sent of Oraclize queries!");
        return;
      }

      bytes32 id = registrars[_registrarType].register.value(cost)(_proof, _addr);
      RegistrationSent(_addr, _proof, id, _registrarType);

      registrarIdToType[id] = _registrarType;
      return id;

  }

  function getCost(uint8 _registrarType) public constant validRegistrar(_registrarType) returns(uint cost) {
    return registrars[_registrarType].getCost();
  }

  function update(bytes32 _id, string _name, address _addr, string _proof) onlyRegistrar {
    addrToName[registrarIdToType[_id]][_addr] = _name;
    nameToAddr[registrarIdToType[_id]][_name] = _addr;
    addrToProof[registrarIdToType[_id]][_addr] = _proof;
    nameToProof[registrarIdToType[_id]][_name] = _proof;
    NameAddressProofRegistered(_addr, _name, _proof, _id, registrarIdToType[_id]);
  }

  function error(bytes32 _id, address _addr, string _result, string _message) onlyRegistrar {
    RegistrarError(_addr, _id, _result, registrarIdToType[_id], _message);
  }

  function getDetail(uint8 _registrarType) public constant validRegistrar(_registrarType) returns(string detail) {
    return registrarDetails[_registrarType];
  }

}
