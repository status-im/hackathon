import token from './token';
const one_month_ago = 874999;

function aggregate(data){
  console.log('aggregate', data)
  let participants = {}
  data.map(function(r){
    if(participants[r.args._to]){
      participants[r.args._to].push(r.args);
    }else{
      participants[r.args._to] = [r.args];
    }
  })

  var rankings = []
  for (var i = 0; i < Object.keys(participants).length; i++) {
    var key = Object.keys(participants)[i]
    var values = participants[key].map(function(r){return r._value.toNumber() });
    var sum = values.reduce((a, b) => a + b, 0);
    rankings.push({
      key:key,
      sum:sum,
      values:values,
    })
  }
  console.log('rankings', rankings)
  var sorted = rankings.sort(function(a,b){return a.sum - b.sum }).reverse();
  return sorted
}

function getAllEvents(cb){
  console.log('one_month_ago', one_month_ago)
  token().then(function(t){
    let tokenEvent = t.Transfer({},{fromBlock:one_month_ago})
    tokenEvent.get(function(error, logs){
      console.log('error', error)
      console.log('aaa', logs)
      cb(aggregate(logs));
    });
  })
}

function getTokenRanking(limit, account, cb){
  console.log('getTokenRanking', limit, account, cb)
  var tops = []
  getAllEvents(function(sorted){
    if (limit == null){
      limit = sorted.length
    }

    for (var i = 0; i < limit; i++) {
      console.log(i+1, sorted[i].sum, sorted[i].values.length)
      tops.push({key:sorted[i].key, rank:i+1, sum:sorted[i].sum, length: sorted[i].values.length});
    }
    var your_rank = null;
    for (var i = 0; i < sorted.length; i++) {
      if (sorted[i].key == account) {
        your_rank = {key:account, rank:i+1, sum:sorted[i].sum, length: sorted[i].values.length};
        break;
      }
    }
    cb({
      tops:tops,
      your_rank: your_rank
    })
  })
}

export default getTokenRanking
// getTokenRanking = require('./lib/token_summary').getTokenRanking
// account = '';
// getTokenRanking(account, function(r){console.log(r)});
//  all['tops'].map(function(d){return [d.key, d.sum]}
