// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <8.10.0;

import "./VoterLinkedList.sol";

contract Poll {
    struct Coin {
        uint256 id;
        string name;
        uint256 firstPlaceCount;
        uint256 secondPlaceCount;
        uint256 thirdPlaceCount;
    }

    struct VotingList {
        address voter;
        address nextVoter;
    }

    mapping(address => bool) public voters;

    mapping(uint256 => Coin) public coins;

    uint256 public coinCount;

    address[] public voteList;

    VoterLinkedList public voteLL;

    event rankedEvent(address indexed _from);

    constructor() public {
        addCoin("BTC");
        addCoin("ETH");
        addCoin("AVAX");
        addCoin("SOL");
        addCoin("LUNA");
    }

    function addCoin(string memory _name) private {
        coinCount++;
        coins[coinCount] = Coin(coinCount, _name, 0, 0, 0);
    }

    function getTotalCoins() public view returns (uint256) {
        return coinCount;
    }

    function getVoteList() external view returns (address[] memory) {
        return voteList;
    }

    function getVoteLL() external view returns (VoterNode) {
        return voteLL.getHead();
    }

    function rank(uint256[] memory coinIds) public {
        require(!voters[msg.sender]);
        require(coinIds.length >= 3);

        voters[msg.sender] = true;
        voteList.push(msg.sender);

        //voteLL.add(msg.sender);

        for (uint256 i = 0; i < 3; i++) {
            require(
                i < coinIds.length && coinIds[i] > 0 && coinIds[i] <= coinCount
            );
        }

        coins[coinIds[0]].firstPlaceCount += 1;
        coins[coinIds[1]].secondPlaceCount += 1;
        coins[coinIds[2]].thirdPlaceCount += 1;

        emit rankedEvent(msg.sender);
    }
}
