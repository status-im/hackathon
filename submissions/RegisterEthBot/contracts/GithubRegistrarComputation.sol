pragma solidity ^0.4.8;

import "./OraclizeRegistrar.sol";

contract GithubRegistrarComputation is RegistrarI, OraclizeRegistrar {

  event OracleQuerySent(string _ipfsComputation, string _proof, bytes32 _id);

  string ipfsComputation = "QmaBkAW9fCtGRrPzExXi5ybAFa9hdaeQWfLHyiFK33m5D3";

  uint oraclizeGasLimit = 380000;

  function GithubRegistrarComputation(address _registry)
  OraclizeRegistrar(_registry) {

  }

  function getCost() onlyRegistry public constant returns(uint cost) {
    return oraclize_getPrice("computation", oraclizeGasLimit);
  }

  function register(string _proof, address _addr) payable onlyRegistry returns(bytes32 oracleId) {

    oracleId = oraclize_query("computation", [ipfsComputation, _proof], oraclizeGasLimit);
    OracleQuerySent(ipfsComputation, _proof, oracleId);
    _register(oracleId, _addr, _proof);
    return oracleId;

  }

}
