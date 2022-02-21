var VoterNode = artifacts.require("./VoterNode.sol");

module.exports = function(deployer) {
  deployer.deploy(VoterNode);
};
