import web3Promise from './web3_promise';
import Web3 from 'web3';
const web3Util = new Web3();

var apiKey = 'AN9EQIRIU7JUFQSKN25J2V37NMMB4DIMVI';

var jQuery = require('jquery');
const Mustache = require('mustache');

var generateUrl = require('./token_detail').generateUrl;
var getBalances = require('./token_detail').getBalances;

function getBalance(address){
  return new Promise(function(resolve,reject){
    web3Promise().then(function(promise){
      console.log('makoto')
      return promise.web3.eth.getBalance(address, function(error, result) {
        resolve(result)
      })
    })
  });
}

function getTransactionHistory(account, cb){
  var view = {
    address: account,
    apiKey:apiKey
  };

  var string = "http://ropsten.etherscan.io/api?module=account&action=txlist&address={{address}}&startblock=0&endblock=99999999&sort=asc&apikey={{apiKey}}";
  var url = Mustache.render(unescape(string), view);

  $.get(url, function( trx ) {
    var logs = trx.result.reverse().map(function(l){
      var value = parseFloat(web3Util.fromWei(parseInt(l.value)));
      return ({
        value: value,
        block: l.blockNumber,
        from: l.from,
        to: l.to,
        timestamp: new Date(l.timeStamp * 1000)
      })
    })
    cb(logs)
  })
}

function getChart(account, cb){
  getTransactionHistory(account, function(response){
    getBalance(account).then(function(_balance){
      let balance = parseFloat(_balance);
      let data = getBalances(balance, account, response)
      let title = account + ' balance history';
      cb(title, data)
    })
  })
}

export default getChart
