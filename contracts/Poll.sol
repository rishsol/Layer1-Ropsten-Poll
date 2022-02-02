// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <8.10.0;

contract Poll {

    struct Coin {
        uint id;
        string name;
        uint firstPlaceCount;
        uint secondPlaceCount;
        uint thirdPlaceCount;
    }

    mapping(address => bool) public voters;

    mapping(uint => Coin) public coins;

    uint public coinCount;

    address public mostRecentVote;

    event rankedEvent (
        uint[] indexed _coinIds
    );

    constructor() public {
        addCoin("BTC");
        addCoin("ETH");
        addCoin("AVAX");
    }

    function addCoin(string memory _name) private {
        coinCount++;
        coins[coinCount] = Coin(coinCount, _name, 0, 0, 0);
    }

    function getTotalCoins() public view returns (uint) {
        return coinCount;
    }

    function getMostRecentVote() public view returns (address) {
        return mostRecentVote;
    }

    function rank(uint[] memory coinIds) public {
        require(!voters[msg.sender]);
        require(coinIds.length >= 3);

        voters[msg.sender] = true;
        mostRecentVote = msg.sender;

        for (uint i = 0; i < 3; i++) {
            require(i < coinIds.length && coinIds[i] > 0 && coinIds[i] <= coinCount);
        }

        coins[coinIds[0]].firstPlaceCount += 1;
        coins[coinIds[1]].secondPlaceCount += 1;
        coins[coinIds[2]].thirdPlaceCount += 1;

        //emit rankedEvent(coinIds);
    }

}