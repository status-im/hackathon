var Owned = artifacts.require('./Owned.sol')
var Escapable = artifacts.require('./Escapable.sol')
var Vault = artifacts.require('./Vault.sol')

module.exports = function(deployer) {
  deployer.deploy(Owned)
  deployer.deploy(Escapable)
  deployer.deploy(Vault)
}
