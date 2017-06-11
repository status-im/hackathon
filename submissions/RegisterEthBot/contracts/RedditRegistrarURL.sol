pragma solidity ^0.4.8;

import "./OraclizeRegistrar.sol";

//Not currently used - replaced by RedditRegistrarComputation which is more stable
contract RedditRegistrarURL is RegistrarI, OraclizeRegistrar {

  event OracleQuerySent(string _proof, bytes32 _id);

  uint oraclizeGasLimit = 280000;

  //json(https://www.reddit.com/r/ethereumproofs/comments/66xvua.json).0.data.children.0.data.[author,title]
  string queryUrlPrepend = 'json(https://www.reddit.com/r/ethereumproofs/comments/';
  string queryUrlAppend = '.json).0.data.children.0.data.[author,title]';

  function getCost() onlyRegistry public constant returns(uint cost) {
    return oraclize_getPrice("URL", oraclizeGasLimit);
  }

  function register(string _proof, address _addr) payable onlyRegistry returns(bytes32 oracleId) {

    string memory oracleQuery = strConcat(queryUrlPrepend, _proof, queryUrlAppend);
    oracleId = oraclize_query("URL", oracleQuery, oraclizeGasLimit);
    OracleQuerySent(oracleQuery, oracleId);
    _register(oracleId, _addr, _proof);
    return oracleId;

  }

}
