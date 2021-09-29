// SPDX-License-Identifier: MIT
pragma solidity ^0.7.3;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockTgbp is ERC20 {
    // 18 decimals
    constructor() ERC20("TrueGBP", "TGBP") {}

    function mint(address _account, uint256 _amount) external {
        _mint(_account, _amount);
    }
}
