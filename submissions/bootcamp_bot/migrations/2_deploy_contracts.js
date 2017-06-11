var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var BootcampProject = artifacts.require("./BootcampProject.sol");

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
  deployer.deploy(BootcampProject);
};
