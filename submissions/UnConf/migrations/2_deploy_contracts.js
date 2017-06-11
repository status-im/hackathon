var strings = artifacts.require("./strings.sol");
var UnConfFactory = artifacts.require("./UnConfFactory.sol");

module.exports = function(deployer) {
  deployer.deploy(strings);
  deployer.link(strings, UnConfFactory);
  deployer.deploy(UnConfFactory);
};
