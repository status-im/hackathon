var PeerCoin = artifacts.require("./PeerCoin.sol")
var Web3 = require('web3')

module.exports = function(deployer) {
  if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
  } else {
      web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
      // web3 = new Web3(new Web3.providers.HttpProvider('http://172.18.150.167:8546'));
  }

  // console.log('output...')
  // web3.eth.getAccounts().then(console.log)

  let peerCoin
  deployer.deploy(PeerCoin).then(() => {
    console.log('deployed...')
    return PeerCoin.deployed()
  })
//   .then((instance) => {
//     peerCoin = instance
//     instance.createGroup("aname", "a").then(() =>
//       {
//         instance.addBetGroup('a-bet', 'can I code this in 5 hours?', 'a').then(() =>
//           instance.addBet('a-bet', 'a', true, 10)
//         )
//         instance.addBetGroup('a2-bet', 'can I code this in 5 hours?', 'a')
//         .then(() =>
//           instance.addBet('a2-bet', 'a', false, 11)
//         )
//       }
//     )
//     instance.createGroup("bname", "b")
//     .then(() =>
//       instance.addBetGroup('b-bet', 'can I code this in 5 hours?', 'b')
//       .then(() =>{
//         instance.addBet('b-bet', 'b', true, 12)
//         instance.inviteUser('b', '0x9ea4ea9f20bdffa9b65c552b1a3d82d00d4a4406').then(()=> {
//           instance.inviteUser('b',  {from: '0x9ea4ea9f20bdffa9b65c552b1a3d82d00d4a4406', gas:3000000})
//         })
//       })
//     )
//     instance.createGroup("cname", "c")
//     .then(() =>
//       instance.addBetGroup('c-bet', 'can I code this in 5 hours?', 'c')
//       .then(() =>
//         instance.addBet('c-bet', 'c', false, 12)
//       )
//     )
//     instance.createGroup("dname", "d")
//     .then(() =>
//       instance.addBetGroup('d-bet', 'can I code this in 5 hours?', 'd')
//       .then(() => {
//         instance.addBet('d-bet', 'd', true, 12)
//         instance.inviteUser('d', '0x9ea4ea9f20bdffa9b65c552b1a3d82d00d4a4406')
//       })
//     )
//     // (bytes32 bgname, bytes32 bgdescription, bytes32 gid)
//     // (bytes32 bgid, bytes32 gid, bool bstance, uint bamount)
//     // instance.addBet('a2-bet', 'a', true, 11)
//
//     return
//     // instance.sendToken("0xf15e7f2ba0476a8a1e76138245f6fd4ffaf04bb4", "a", 5)
//     // instance.sendToken("0xf15e7F2bA0476A8a1e76138245f6Fd4FfaF04bB4", "b", 123)
//     // instance.sendToken("0xf15e7F2bA0476A8a1e76138245f6Fd4FfaF04bB4", "c", 55)
//
//     // console.log('yeeah')
//     // .then((error, accounts) => {
//     //   console.log('accounts', accounts)
//     //   // Do things with specific accounts...
//     // })
//   }).then(()=>{
//     peerCoin.sendToken("0xf15e7f2ba0476a8a1e76138245f6fd4ffaf04bb4", "a", 95)
//     peerCoin.sendToken("0xf15e7F2bA0476A8a1e76138245f6Fd4FfaF04bB4", "b", 123)
//     peerCoin.sendToken("0xf15e7F2bA0476A8a1e76138245f6Fd4FfaF04bB4", "c", 55)
//   })
//   .then(()=>{
//     peerCoin.inviteUser('a', "0xf15e7f2ba0476a8a1e76138245f6fd4ffaf04bb4")
//   })
}
//
// var Registry = artifacts.require(“./Registry.sol”);
// var RedditRegistrarComputation = artifacts.require(“./RedditRegistrarComputation.sol”)
// var GithubRegistrarComputation = artifacts.require(“./GithubRegistrarComputation.sol”)
//
// module.exports = function(deployer) {
//   var registry;
//   deployer.deploy(Registry).then(function() {
//     return deployer.deploy(RedditRegistrarComputation, Registry.address);
//   }).then(function() {
//     return deployer.deploy(GithubRegistrarComputation, Registry.address);
//   }).then(function() {
//     return Registry.deployed();
//   }).then(function(instance) {
//     registry = instance;
//     return registry.createRegistrar(“reddit”, RedditRegistrarComputation.address);
//   }).then(function(txId) {
//     return registry.createRegistrar(“github”, GithubRegistrarComputation.address);
//   });
// };
