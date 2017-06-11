import web3Promise from './web3_promise';
const token_address = '0x4bda828f1fe628973c39366263b78b7cd9d6d8fe';
const abi = require('human-standard-token-abi');

export function token() {
  return new Promise(function(resolve, reject){
    web3Promise().then(function(promise){
      resolve(promise.web3.eth.contract(abi).at(token_address));
    })
  })
}

export default token
