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
import "@openzeppelin/contracts/math/SafeMath.sol";

import "../lib/ABDKMath64x64.sol";
import "../interfaces/IAssimilator.sol";
import "../interfaces/IOracle.sol";

contract TgbpToUsdAssimilator is IAssimilator {
    using ABDKMath64x64 for int128;
    using ABDKMath64x64 for uint256;

    using SafeMath for uint256;

    IOracle private constant oracle = IOracle(0x28b0061f44E6A9780224AA61BEc8C3Fcb0d37de9);
    IERC20 private constant usdc = IERC20(0x12513dd17Ae75AF37d9eb21124f98b04705Be906);
    IERC20 private constant tgbp = IERC20(0x2610D021d0BA2b9D56e8F163cb6B12b2cF8E7588);
    uint256 private constant BASE_DECIMALS = 1e18;

    // solhint-disable-next-line
    constructor() {}

    function getRate() public view override returns (uint256) {
        (, int256 price, , , ) = oracle.latestRoundData();
        return uint256(price);
    }

    // takes raw tgbp amount, transfers it in, calculates corresponding numeraire amount and returns it
    function intakeRawAndGetBalance(uint256 _amount) external override returns (int128 amount_, int128 balance_) {
        bool _transferSuccess = tgbp.transferFrom(msg.sender, address(this), _amount);

        require(_transferSuccess, "Curve/TGBP-transfer-from-failed");

        uint256 _balance = tgbp.balanceOf(address(this));

        uint256 _rate = getRate();

        balance_ = ((_balance * _rate) / 1e8).divu(BASE_DECIMALS);

        amount_ = ((_amount * _rate) / 1e8).divu(BASE_DECIMALS);
    }

    // takes raw tgbp amount, transfers it in, calculates corresponding numeraire amount and returns it
    function intakeRaw(uint256 _amount) external override returns (int128 amount_) {
        bool _transferSuccess = tgbp.transferFrom(msg.sender, address(this), _amount);

        require(_transferSuccess, "Curve/tgbp-transfer-from-failed");

        uint256 _rate = getRate();

        amount_ = ((_amount * _rate) / 1e8).divu(BASE_DECIMALS);
    }

    // takes a numeraire amount, calculates the raw amount of tgbp, transfers it in and returns the corresponding raw amount
    function intakeNumeraire(int128 _amount) external override returns (uint256 amount_) {
        uint256 _rate = getRate();

        amount_ = (_amount.mulu(BASE_DECIMALS) * 1e8) / _rate;

        bool _transferSuccess = tgbp.transferFrom(msg.sender, address(this), amount_);

        require(_transferSuccess, "Curve/TGBP-transfer-from-failed");
    }

    // takes a numeraire account, calculates the raw amount of tgbp, transfers it in and returns the corresponding raw amount
    function intakeNumeraireLPRatio(
        uint256 _baseWeight,
        uint256 _quoteWeight,
        address _addr,
        int128 _amount
    ) external override returns (uint256 amount_) {
        uint256 _cadcBal = tgbp.balanceOf(_addr);

        if (_cadcBal <= 0) return 0;

        // BASE_DECIMALS
        _cadcBal = _cadcBal.mul(1e18).div(_baseWeight);

        // 1e6
        uint256 _usdcBal = usdc.balanceOf(_addr).mul(1e18).div(_quoteWeight);

        // Rate is in 1e6
        uint256 _rate = _usdcBal.mul(BASE_DECIMALS).div(_cadcBal);

        amount_ = (_amount.mulu(BASE_DECIMALS) * 1e6) / _rate;

        bool _transferSuccess = tgbp.transferFrom(msg.sender, address(this), amount_);

        require(_transferSuccess, "Curve/TGBP-transfer-from-failed");
    }

    // takes a raw amount of tgbp and transfers it out, returns numeraire value of the raw amount
    function outputRawAndGetBalance(address _dst, uint256 _amount)
        external
        override
        returns (int128 amount_, int128 balance_)
    {
        uint256 _rate = getRate();

        uint256 _cadcAmount = ((_amount) * _rate) / 1e8;

        bool _transferSuccess = tgbp.transfer(_dst, _cadcAmount);

        require(_transferSuccess, "Curve/TGBP-transfer-failed");

        uint256 _balance = tgbp.balanceOf(address(this));

        amount_ = _cadcAmount.divu(BASE_DECIMALS);

        balance_ = ((_balance * _rate) / 1e8).divu(BASE_DECIMALS);
    }

    // takes a raw amount of tgbp and transfers it out, returns numeraire value of the raw amount
    function outputRaw(address _dst, uint256 _amount) external override returns (int128 amount_) {
        uint256 _rate = getRate();

        uint256 _cadcAmount = (_amount * _rate) / 1e8;

        bool _transferSuccess = tgbp.transfer(_dst, _cadcAmount);

        require(_transferSuccess, "Curve/TGBP-transfer-failed");

        amount_ = _cadcAmount.divu(BASE_DECIMALS);
    }

    // takes a numeraire value of tgbp, figures out the raw amount, transfers raw amount out, and returns raw amount
    function outputNumeraire(address _dst, int128 _amount) external override returns (uint256 amount_) {
        uint256 _rate = getRate();

        amount_ = (_amount.mulu(BASE_DECIMALS) * 1e8) / _rate;

        bool _transferSuccess = tgbp.transfer(_dst, amount_);

        require(_transferSuccess, "Curve/TGBP-transfer-failed");
    }

    // takes a numeraire amount and returns the raw amount
    function viewRawAmount(int128 _amount) external view override returns (uint256 amount_) {
        uint256 _rate = getRate();

        amount_ = (_amount.mulu(BASE_DECIMALS) * 1e8) / _rate;
    }

    function viewRawAmountLPRatio(
        uint256 _baseWeight,
        uint256 _quoteWeight,
        address _addr,
        int128 _amount
    ) external view override returns (uint256 amount_) {
        uint256 _cadcBal = tgbp.balanceOf(_addr);

        if (_cadcBal <= 0) return 0;

        // BASE_DECIMALS
        _cadcBal = _cadcBal.mul(1e18).div(_baseWeight);

        // 1e6
        uint256 _usdcBal = usdc.balanceOf(_addr).mul(1e18).div(_quoteWeight);

        // Rate is in 1e6
        uint256 _rate = _usdcBal.mul(BASE_DECIMALS).div(_cadcBal);

        amount_ = (_amount.mulu(BASE_DECIMALS) * 1e6) / _rate;
    }

    // takes a raw amount and returns the numeraire amount
    function viewNumeraireAmount(uint256 _amount) external view override returns (int128 amount_) {
        uint256 _rate = getRate();

        amount_ = ((_amount * _rate) / 1e8).divu(BASE_DECIMALS);
    }

    // views the numeraire value of the current balance of the reserve, in this case tgbp
    function viewNumeraireBalance(address _addr) external view override returns (int128 balance_) {
        uint256 _rate = getRate();

        uint256 _balance = tgbp.balanceOf(_addr);

        if (_balance <= 0) return ABDKMath64x64.fromUInt(0);

        balance_ = ((_balance * _rate) / 1e8).divu(BASE_DECIMALS);
    }

    // views the numeraire value of the current balance of the reserve, in this case tgbp
    function viewNumeraireAmountAndBalance(address _addr, uint256 _amount)
        external
        view
        override
        returns (int128 amount_, int128 balance_)
    {
        uint256 _rate = getRate();

        amount_ = ((_amount * _rate) / 1e8).divu(BASE_DECIMALS);

        uint256 _balance = tgbp.balanceOf(_addr);

        balance_ = ((_balance * _rate) / 1e8).divu(BASE_DECIMALS);
    }

    // views the numeraire value of the current balance of the reserve, in this case tgbp
    // instead of calculating with chainlink's "rate" it'll be determined by the existing
    // token ratio. This is in here to prevent LPs from losing out on future oracle price updates
    function viewNumeraireBalanceLPRatio(
        uint256 _baseWeight,
        uint256 _quoteWeight,
        address _addr
    ) external view override returns (int128 balance_) {
        uint256 _cadcBal = tgbp.balanceOf(_addr);

        if (_cadcBal <= 0) return ABDKMath64x64.fromUInt(0);

        uint256 _usdcBal = usdc.balanceOf(_addr).mul(1e18).div(_quoteWeight);

        // Rate is in 1e6
        uint256 _rate = _usdcBal.mul(1e18).div(_cadcBal.mul(1e18).div(_baseWeight));

        balance_ = ((_cadcBal * _rate) / 1e6).divu(1e18);
    }
}
