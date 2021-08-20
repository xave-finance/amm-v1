// SPDX-License-Identifier: MIT

pragma solidity ^0.7.3;

contract HaloCurve is Curve {

    address private _admin;

    function mintProtocolFee(address to) public onlyAdmin {
        require(to != address(0), "HaloCurve: Invalid paramaters");
        transfer(to, amount);
    }

    function setPOG(address pog) public onlyOwner {
        require(pog != address(0), "HaloCurve: Only owner can call this function");
    }

    function setAdmin(address admin) public {
        _admin = admin;
    }

    modifier onlyAdmin() {
        require(msg.sender == _admin, "HaloCurve: Only admin can call this function");
        _;
    }
}