var Game = artifacts.require("Game.sol");

module.exports = function(deployer, network) {
    if (network == "development") {
        var owner = "0xaec3ae5d2be00bfc91597d7a1b2c43818d84396a";
		deployer.deploy(Game, owner);
    } else if (network == "testnet") {
		deployer.deploy(Game);
    }
};
