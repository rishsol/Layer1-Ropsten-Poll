pragma solidity >=0.4.21 <8.10.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/VoterLinkedList.sol";

contract TestVoterLinkedList {
    function testAdd() public {
        VoterLinkedList vll = VoterLinkedList(
            DeployedAddresses.VoterLinkedList()
        );

        vll.add((address)(0x111));
        Assert.equal(vll.getSize(), 1, "Size should be 1.");

        vll.add((address)(0x112));
        Assert.equal(vll.getSize(), 2, "Size should be 2.");
        Assert.equal(
            vll.getHead().getName(),
            (address)(0x112),
            "Name should be 0x112"
        );
        Assert.equal(
            vll.getHead().getNext().getName(),
            (address)(0x111),
            "second item name should be 0x111"
        );
    }
}
