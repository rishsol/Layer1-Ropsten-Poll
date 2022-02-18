pragma solidity >=0.4.21 <8.10.0;

contract VoterNode {
    address public name;
    VoterNode public next;

    function getName() public view returns (address) {
        return name;
    }

    function getNext() public view returns (VoterNode) {
        return next;
    }

    function setName(address _name) public {
        name = _name;
    }
    
    function setNext(VoterNode _next) public {
        next = _next;
    }
}