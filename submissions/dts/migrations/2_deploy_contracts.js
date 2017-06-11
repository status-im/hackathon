var AdsRegistry = artifacts.require("./AdsRegistry.sol");
var TeacherRegistry = artifacts.require("./TeacherRegistry.sol");
var CourseRegistry = artifacts.require("./CourseRegistry.sol");

module.exports = function(deployer) {
  deployer.deploy(AdsRegistry);
  deployer.deploy(TeacherRegistry);
  deployer.deploy(CourseRegistry);
}