pragma solidity ^0.4.8;

import "../installed_contracts/oraclize/contracts/usingOraclize.sol";

contract OraclizeAPI is usingOraclize {

  event OracleURLSent(bytes32 _id, string _query);
  event OracleComputationSent(bytes32 _id, string _script, string _args);
  event OracleReceived(bytes32 _id, string _result);

  function testURL(string _query) payable public {
    bytes32 id = oraclize_query("URL", _query);
    OracleURLSent(id, _query);
  }

  function testComputation(string _script, string _args) payable public {
    bytes32 id = oraclize_query("computation", [_script, _args]);
    OracleComputationSent(id, _script, _args);
  }

  function __callback(bytes32 _id, string _result) {
    OracleReceived(_id, _result);
  }

}
