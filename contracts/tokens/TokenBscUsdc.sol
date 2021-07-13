pragma solidity ^0.7.3;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract USDC is ERC20 {
    string public functionCalled;
    uint8 public constant DECIMALS = 18;
    uint256 public constant INITIAL_SUPPLY = 1000000 * (10**uint256(DECIMALS));

    constructor() public ERC20("USDC", "USDC") {
        _mint(msg.sender, 1000000 * (10**uint256(decimals())));
    }

    fallback() external payable {
        functionCalled = "fallback";
    }

    function ethBal() public view returns (uint256) {
        return address(this).balance;
    }
}
