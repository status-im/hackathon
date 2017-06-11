pragma solidity ^0.4.8;

import "../installed_contracts/oraclize/contracts/usingOraclize.sol";
import '../installed_contracts/zeppelin/contracts/ownership/Ownable.sol';

import "./RegistrarI.sol";
import "./RegistryI.sol";

//Base class for oraclize based registrar - abstract
contract OraclizeRegistrar is Ownable, usingOraclize {

  event OracleQueryReceived(string _result, bytes32 _id);
  event AddressMismatch(address _oracleAddr, address _addr);
  event BadOracleResult(string _message, string _result, bytes32 _id);

  mapping (bytes32 => address) oracleExpectedAddress;
  mapping (bytes32 => string) oracleProof;
  mapping (bytes32 => bool) oracleCallbackComplete;

  RegistryI registry;

  modifier onlyOraclizeOrRegistry() {
    if ((msg.sender != address(registry)) && (msg.sender != oraclize_cbAddress())) {
      throw;
    }
    _;
  }

  modifier onlyRegistry() {
    if (msg.sender != address(registry)) {
      throw;
    }
    _;
  }

  function OraclizeRegistrar(address _registry) {
    registry = RegistryI(_registry);
  }

  function __callback(bytes32 _id, string _result) {
    //Check basic error conditions (throw on error)
    if (msg.sender != oraclize_cbAddress()) throw;
    if (oracleCallbackComplete[_id]) throw;
    _callback(_id, _result);
  }

  function _callback(bytes32 _id, string _result) onlyOraclizeOrRegistry {

    //Record callback received
    oracleCallbackComplete[_id] = true;
    OracleQueryReceived(_result, _id);

    //Check contract specific error conditions (set event and return on error)
    var (success, redditName, redditAddrString) = parseResult(_result);
    if (!success) {
      BadOracleResult("Incorrect length data returned from Oracle", _result, _id);
      registry.error(_id, oracleExpectedAddress[_id], _result, "Unable to parse Oraclize response");
    } else {
      //Check validity of claim to address
      address redditAddr = parseAddr(redditAddrString);
      if (oracleExpectedAddress[_id] != redditAddr) {
        AddressMismatch(redditAddr, oracleExpectedAddress[_id]);
        registry.error(_id, oracleExpectedAddress[_id], _result, "Address mismatch");
      } else {
        //We can now update our registry!!!
        registry.update(_id, redditName, redditAddr, oracleProof[_id]);
      }
    }

  }

  function _register(bytes32 oracleId, address expectedAddress, string proof) onlyRegistry {
    oracleExpectedAddress[oracleId] = expectedAddress;
    oracleProof[oracleId] = proof;
  }

  function _clearOracleId(bytes32 oracleId) onlyRegistry {
    oracleExpectedAddress[oracleId] = 0x0;
    oracleProof[oracleId] = "";
    oracleCallbackComplete[oracleId] = false;
  }

  function parseResult(string _input) internal returns (bool success, string name, string addr) {
    bytes memory inputBytes = bytes(_input);
    //Zero length input
    if (inputBytes.length == 0) {
      //below amounts to false, "", ""
      return (success, name, addr);
    }
    //Non array input
    if (inputBytes[0] != '[' || inputBytes[inputBytes.length - 1] != ']') {
      return (success, name, addr);
    }
    //Sensible length (current reddit username is max. 20 chars, ethereum address is 42 chars)
    if (inputBytes.length > 80) {
      return (success, name, addr);
    }
    //Need to loop twice:
    //Outer loop to determine length of token
    //Inner loop to initialize token with correct length and populate
    uint tokensFound = 0;
    bytes memory bytesBuffer;
    uint bytesLength = 0;
    uint bytesStart;
    uint inputPos = 0;
    
    bool reading = false;
    //We know first and last bytes are square brackets
    for (inputPos = 1; inputPos < inputBytes.length - 1; inputPos++) {
      //Ignore escaped speech marks
      if ((inputBytes[inputPos] == '"') && (inputBytes[inputPos - 1] != '\\')) {
        if (!reading) {
          bytesStart = inputPos + 1;
        }
        if (reading) {
          bytesBuffer = new bytes(bytesLength);
          for (uint i = bytesStart; i < inputPos; i++) {
            bytesBuffer[i - bytesStart] = inputBytes[i];
          }
          if (tokensFound == 0) {
            name = string(bytesBuffer);
          } else {
            //Otherwise parseAddr will throw
            if (bytesLength != 42) {
              return (success, name, addr);
            }
            addr = string(bytesBuffer);
          }
          bytesLength = 0;
          tokensFound++;
        }
        reading = !reading;
        continue;
      }
      if (reading) {
        bytesLength++;
      }
    }
    if (tokensFound != 2) {
      return (success, name, addr);
    }
    success = true;
    return (success, name, addr);
  }

}
