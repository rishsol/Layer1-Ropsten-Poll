pragma solidity >=0.4.21 <8.10.0;

import "./VoterNode.sol";

contract VoterLinkedList {

    VoterNode public HEAD;
    uint public size;

    function add(address name) public {
        VoterNode newNode = new VoterNode();
        newNode.setName(name);

        if (size == 0) {
            HEAD = newNode;
        } else {
            VoterNode prevFirst = HEAD;
            HEAD = newNode;
            HEAD.setNext(prevFirst);
        }
        size += 1;
    }

    function getHead() public view returns (VoterNode) {
        return HEAD;
    }

    function getSize() public view returns (uint) {
        return size;
    }
}