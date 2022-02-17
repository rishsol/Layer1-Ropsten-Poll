pragma solidity >=0.4.21 <8.10.0;

contract VoterNode {
    address public name;
    VoterNode public next;

    function setName(address _name) public {
        name = _name;
    }
    
    function setNext(VoterNode _next) public {
        next = _next;
    }

    /*
    constructor(string memory _name) {
        name = _name;
    }

    constructor (string memory _name, VoterNode _next) {
        name = _name;
        next = _next;
    }

    /*
    constructor(string memory _name, VoterNode _next) {
        name = _name;
        next = _next;
    }
    */
}