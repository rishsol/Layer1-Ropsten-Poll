const Poll = artifacts.require("./Poll.sol");

contract("Poll", (accounts) => {
  let poll = null;

  before(async () => {
    poll = await Poll.deployed();
  });

  it("initiates polling with 4 coins", async () => {
    const count = await poll.getTotalCoins.call();
    assert.equal(count, 4, "4 coins not created");
  });

  it("allows users to rank coins appropriately", async () => {
    await poll
      .rank([3, 2, 1], { from: accounts[0] })
      .then(function (instance) {
        return poll.coins(1);
      })
      .then(function (coin) {
        assert.equal(coin[4], 1, "third place count should be 1");
        return poll.coins(2);
      })
      .then(function (coin) {
        assert.equal(coin[3], 1, "second place count should be 1");
        return poll.coins(3);
      })
      .then(function (coin) {
        assert.equal(coin[1], 'AVAX', 'This should be avalanche coin');
        assert.equal(coin[2], 1, "first place count should be 1");
      });
  });
});
