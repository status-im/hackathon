import web3Promise from './web3_promise';
import token from './token';
import Web3 from 'web3';
const web3Util = new Web3();

const one_month_ago = 874999

function getBalance(address){
  return new Promise(function(resolve,reject){
    return token().then(function(t){
      return t.balanceOf.call(address, function(err, result){
        return resolve(result)
      })
    })
  });
}

function getBalances(balance, account, array){
  let initial_balance = balance;
  let result = array.map(function(a){
    var obj = {
      balance:balance,
      value: a.value,
      from: a.from,
      to: a.to,
      timestamp: a.timestamp,
      block:a.block
    }
    if (account == obj.to) {
      balance-= a.value;
    }else{
      balance+= a.value;
    }
    return obj;
  })
  result.unshift({
    balance:initial_balance,
    timestamp: new Date()
  })
  return result;
}

function getTransactionHistory(account, cb){
  token().then(function(t){
    t
      .Transfer({_to:account},{fromBlock:one_month_ago})
      .get(function(error, logs){
        if (error) {
          console.log('error', error)
        }
        let promised_logs = logs.map(l => {
          return new Promise(function(fulfilled, rejected){
            console.log('n', l);
            web3.eth.getBlock(l.blockNumber, (error,block) =>{
              console.log('l, block', l, block)
              return fulfilled([l, block])
            })
          })
        })
        Promise.all(promised_logs).then((values) => {
          logs = values.reverse().map(function(value){
            var l = value[0]
            var block = value[1]
            return ({
              value: l.args._value.toNumber(),
              block: l.blockNumber,
              from: l.args._from,
              to: l.args._to,
              timestamp: new Date(block.timestamp * 1000)
            })
          })
          cb(logs)
        });
      });
  })
}

function generateUrl(title, data){
  url = 'https://image-charts.com/chart?chs=500x190';
  url+= '&chd=t:' + data.join();
  url+= '&chds=a&cht=lc&chtt=' + title;
  return url
}

function getChart(account, cb){
  getTransactionHistory(account, function(response){
    getBalance(account).then(function(balance){
      let data = getBalances(balance, account, response)
      token().then(function(t){
        t.symbol.call((err, symbol)=>{
          cb(symbol + ' balance for the last one month', data);
        })
      })
    })
  })
}

export default getChart
export {
   getBalances,
   getTransactionHistory,
   generateUrl
}

// getTransactionHistory = require('./lib/token').getTransactionHistory;
// account = '';
// getTransactionHistory(account, function(r){console.log(r)})
