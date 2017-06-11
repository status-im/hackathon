pragma solidity ^0.4.8;

import "./OraclizeRegistrar.sol";

contract TwitterRegistrarComputation is RegistrarI, OraclizeRegistrar {

  event OracleQuerySent(string _ipfsComputation, string _proof, string _addr, bytes32 _id);

  string ipfsComputation = "QmYqNMvekTekU1miTTSm8RzzbQUo9Z5eAkG9dRgRX2jrCR";

  uint oraclizeGasLimit = 280000;

  function TwitterRegistrarComputation(address _registry)
  OraclizeRegistrar(_registry) {

  }

  function getCost() onlyRegistry public constant returns(uint cost) {
    return oraclize_getPrice("computation", oraclizeGasLimit);
  }

  function register(string _proof, address _addr) payable onlyRegistry returns(bytes32 oracleId) {

    oracleId = oraclize_query("computation", [ipfsComputation, _proof, toAsciiString(_addr)], oraclizeGasLimit);
    OracleQuerySent(ipfsComputation, _proof, toAsciiString(_addr), oracleId);
    _register(oracleId, _addr, _proof);
    return oracleId;

  }

  function toAsciiString(address x) returns (string) {
      bytes memory s = new bytes(40);
      for (uint i = 0; i < 20; i++) {
          byte b = byte(uint8(uint(x) / (2**(8*(19 - i)))));
          byte hi = byte(uint8(b) / 16);
          byte lo = byte(uint8(b) - 16 * uint8(hi));
          s[2*i] = char(hi);
          s[2*i+1] = char(lo);
      }
      return strConcat("0x",string(s));
  }

  function char(byte b) returns (byte c) {
      if (b < 10) return byte(uint8(b) + 0x30);
      else return byte(uint8(b) + 0x57);
  }

}
