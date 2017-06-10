var Chitta = artifacts.require("./Chitta.sol");
var Users = artifacts.require("./Users.sol");
module.exports = function(deployer) {
  deployer.deploy(Chitta, "Arani", "TVM", "@", 10000);
  deployer.deploy(Users);
};
