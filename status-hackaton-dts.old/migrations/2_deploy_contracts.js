var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var AdsRegistry = artifacts.require("./AdsRegistry.sol");

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
  deployer.deploy(AdsRegistry);
