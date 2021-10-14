// SPDX-License-Identifier: MIT

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

pragma solidity ^0.7.3;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "../lib/ABDKMath64x64.sol";
import "../interfaces/IAssimilator.sol";
import "../interfaces/IOracle.sol";

contract UsdtToUsdAssimilator is IAssimilator {
    using ABDKMath64x64 for int128;
    using ABDKMath64x64 for uint256;

    IOracle private constant oracle = IOracle(0x2ca5A90D34cA333661083F89D831f757A9A50148);
    IERC20 private constant usdt = IERC20(0x9CB5d3418c924EEeC0e04BA86988fBAf672867d5);

    uint256 private constant DECIMALS = 1e6;

    // solhint-disable-next-line
    function getRate() public view override returns (uint256) {
        return uint256(oracle.latestAnswer());
    }

    function intakeRawAndGetBalance(uint256 _amount) external override returns (int128 amount_, int128 balance_) {
        bool _success = usdt.transferFrom(msg.sender, address(this), _amount);

        require(_success, "Curve/USDT-transfer-from-failed");

        uint256 _balance = usdt.balanceOf(address(this));

        uint256 _rate = getRate();

        balance_ = ((_balance * _rate) / 1e8).divu(DECIMALS);

        amount_ = ((_amount * _rate) / 1e8).divu(DECIMALS);
    }

    function intakeRaw(uint256 _amount) external override returns (int128 amount_) {
        bool _success = usdt.transferFrom(msg.sender, address(this), _amount);

        require(_success, "Curve/USDT-transfer-from-failed");

        uint256 _rate = getRate();

        amount_ = ((_amount * _rate) / 1e8).divu(DECIMALS);
    }

    function intakeNumeraire(int128 _amount) external override returns (uint256 amount_) {
        uint256 _rate = getRate();

        amount_ = (_amount.mulu(DECIMALS) * 1e8) / _rate;

        bool _success = usdt.transferFrom(msg.sender, address(this), amount_);

        require(_success, "Curve/USDT-transfer-from-failed");
    }

    function intakeNumeraireLPRatio(
        uint256,
        uint256,
        address,
        int128 _amount
    ) external override returns (uint256 amount_) {
        amount_ = _amount.mulu(DECIMALS);

        bool _success = usdt.transferFrom(msg.sender, address(this), amount_);

        require(_success, "Curve/USDT-transfer-from-failed");
    }

    function outputRawAndGetBalance(address _dst, uint256 _amount)
        external
        override
        returns (int128 amount_, int128 balance_)
    {
        uint256 _rate = getRate();

        uint256 _usdcAmount = ((_amount * _rate) / 1e8);

        bool _success = usdt.transfer(_dst, _usdcAmount);

        require(_success, "Curve/USDT-transfer-failed");

        uint256 _balance = usdt.balanceOf(address(this));

        amount_ = _usdcAmount.divu(DECIMALS);

        balance_ = ((_balance * _rate) / 1e8).divu(DECIMALS);
    }

    function outputRaw(address _dst, uint256 _amount) external override returns (int128 amount_) {
        uint256 _rate = getRate();

        uint256 _usdcAmount = (_amount * _rate) / 1e8;

        bool _success = usdt.transfer(_dst, _usdcAmount);

        require(_success, "Curve/USDT-transfer-failed");

        amount_ = _usdcAmount.divu(DECIMALS);
    }

    function outputNumeraire(address _dst, int128 _amount) external override returns (uint256 amount_) {
        uint256 _rate = getRate();

        amount_ = (_amount.mulu(DECIMALS) * 1e8) / _rate;

        bool _success = usdt.transfer(_dst, amount_);

        require(_success, "Curve/USDT-transfer-failed");
    }

    function viewRawAmount(int128 _amount) external view override returns (uint256 amount_) {
        uint256 _rate = getRate();

        amount_ = (_amount.mulu(DECIMALS) * 1e8) / _rate;
    }

    function viewRawAmountLPRatio(
        uint256,
        uint256,
        address,
        int128 _amount
    ) external pure override returns (uint256 amount_) {
        amount_ = _amount.mulu(DECIMALS);
    }

    function viewNumeraireAmount(uint256 _amount) external view override returns (int128 amount_) {
        uint256 _rate = getRate();

        amount_ = ((_amount * _rate) / 1e8).divu(DECIMALS);
    }

    function viewNumeraireBalance(address _addr) public view override returns (int128 balance_) {
        uint256 _rate = getRate();

        uint256 _balance = usdt.balanceOf(_addr);

        if (_balance <= 0) return ABDKMath64x64.fromUInt(0);

        balance_ = ((_balance * _rate) / 1e8).divu(DECIMALS);
    }

    // views the numeraire value of the current balance of the reserve wrt to USD
    // since this is already the USD assimlator, the ratio is just 1
    function viewNumeraireBalanceLPRatio(
        uint256,
        uint256,
        address _addr
    ) external view override returns (int128 balance_) {
        uint256 _balance = usdt.balanceOf(_addr);

        return _balance.divu(DECIMALS);
    }

    function viewNumeraireAmountAndBalance(address _addr, uint256 _amount)
        external
        view
        override
        returns (int128 amount_, int128 balance_)
    {
        uint256 _rate = getRate();

        amount_ = ((_amount * _rate) / 1e8).divu(DECIMALS);

        uint256 _balance = usdt.balanceOf(_addr);

        balance_ = ((_balance * _rate) / 1e8).divu(DECIMALS);
    }
}
