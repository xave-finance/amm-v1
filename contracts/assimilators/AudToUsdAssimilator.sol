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

contract AudToUsdAssimilator is IAssimilator {
    using ABDKMath64x64 for int128;
    using ABDKMath64x64 for uint256;

    using SafeMath for uint256;

    // Kovan
    IOracle private constant oracle = IOracle(0x5813A90f826e16dB392abd2aF7966313fc1fd5B8);
    IERC20 private constant usdc = IERC20(0x12513dd17Ae75AF37d9eb21124f98b04705Be906);
    IERC20 private constant aud = IERC20(0x9d7Ea50eef0DB4ae470E1f16bE64A591f361ab81);

    uint256 private constant DECIMALS = 1e18;

    function getRate() public view override returns (uint256) {
        (, int256 price, , , ) = oracle.latestRoundData();
        return uint256(price);
    }

    // takes raw aud amount, transfers it in, calculates corresponding numeraire amount and returns it
    function intakeRawAndGetBalance(uint256 _amount) external override returns (int128 amount_, int128 balance_) {
        bool _transferSuccess = aud.transferFrom(msg.sender, address(this), _amount);

        require(_transferSuccess, "Curve/AUD-transfer-from-failed");

        uint256 _balance = aud.balanceOf(address(this));

        uint256 _rate = getRate();

        balance_ = ((_balance * _rate).div(1e8)).divu(DECIMALS);

        amount_ = ((_amount * _rate).div(1e8)).divu(DECIMALS);
    }

    // takes raw aud amount, transfers it in, calculates corresponding numeraire amount and returns it
    function intakeRaw(uint256 _amount) external override returns (int128 amount_) {
        bool _transferSuccess = aud.transferFrom(msg.sender, address(this), _amount);

        require(_transferSuccess, "Curve/aud-transfer-from-failed");

        uint256 _rate = getRate();

        amount_ = ((_amount * _rate).div(1e8)).divu(DECIMALS);
    }

    // takes a numeraire amount, calculates the raw amount of aud, transfers it in and returns the corresponding raw amount
    function intakeNumeraire(int128 _amount) external override returns (uint256 amount_) {
        uint256 _rate = getRate();

        amount_ = (_amount.mulu(DECIMALS) * 1e8).div(_rate);

        bool _transferSuccess = aud.transferFrom(msg.sender, address(this), amount_);

        require(_transferSuccess, "Curve/AUD-transfer-from-failed");
    }

    // takes a numeraire account, calculates the raw amount of aud, transfers it in and returns the corresponding raw amount
    function intakeNumeraireLPRatio(
        uint256 _baseWeight,
        uint256 _quoteWeight,
        address _addr,
        int128 _amount
    ) external override returns (uint256 amount_) {
        uint256 _audBal = aud.balanceOf(_addr);

        if (_audBal <= 0) return 0;

        uint256 _usdcBal = usdc.balanceOf(_addr).mul(DECIMALS).div(_quoteWeight);

        // Rate is in 1e6
        uint256 _rate = _usdcBal.mul(DECIMALS).div(_audBal.mul(DECIMALS).div(_baseWeight));

        amount_ = (_amount.mulu(DECIMALS) * 1e6).div(_rate);

        bool _transferSuccess = aud.transferFrom(msg.sender, address(this), amount_);

        require(_transferSuccess, "Curve/AUD-transfer-from-failed");
    }

    // takes a raw amount of aud and transfers it out, returns numeraire value of the raw amount
    function outputRawAndGetBalance(address _dst, uint256 _amount)
        external
        override
        returns (int128 amount_, int128 balance_)
    {
        uint256 _rate = getRate();

        uint256 _audAmount = ((_amount) * _rate).div(1e8);

        bool _transferSuccess = aud.transfer(_dst, _audAmount);

        require(_transferSuccess, "Curve/AUD-transfer-failed");

        uint256 _balance = aud.balanceOf(address(this));

        amount_ = _audAmount.divu(DECIMALS);

        balance_ = ((_balance * _rate).div(1e8)).divu(DECIMALS);
    }

    // takes a raw amount of aud and transfers it out, returns numeraire value of the raw amount
    function outputRaw(address _dst, uint256 _amount) external override returns (int128 amount_) {
        uint256 _rate = getRate();

        uint256 _audAmount = (_amount * _rate).div(1e8);

        bool _transferSuccess = aud.transfer(_dst, _audAmount);

        require(_transferSuccess, "Curve/AUD-transfer-failed");

        amount_ = _audAmount.divu(DECIMALS);
    }

    // takes a numeraire value of aud, figures out the raw amount, transfers raw amount out, and returns raw amount
    function outputNumeraire(address _dst, int128 _amount) external override returns (uint256 amount_) {
        uint256 _rate = getRate();

        amount_ = (_amount.mulu(DECIMALS) * 1e8).div(_rate);

        bool _transferSuccess = aud.transfer(_dst, amount_);

        require(_transferSuccess, "Curve/AUD-transfer-failed");
    }

    // takes a numeraire amount and returns the raw amount
    function viewRawAmount(int128 _amount) external view override returns (uint256 amount_) {
        uint256 _rate = getRate();

        amount_ = (_amount.mulu(DECIMALS) * 1e8).div(_rate);
    }

    // takes a numeraire amount and returns the raw amount without the rate
    function viewRawAmountLPRatio(
        uint256 _baseWeight,
        uint256 _quoteWeight,
        address _addr,
        int128 _amount
    ) external view override returns (uint256 amount_) {
        uint256 _audBal = aud.balanceOf(_addr);

        if (_audBal <= 0) return 0;

        uint256 _usdcBal = usdc.balanceOf(_addr).mul(DECIMALS).div(_quoteWeight);

        // Rate is in 1e6
        uint256 _rate = _usdcBal.mul(DECIMALS).div(_audBal.mul(DECIMALS).div(_baseWeight));

        amount_ = (_amount.mulu(DECIMALS) * 1e6).div(_rate);
    }

    // takes a raw amount and returns the numeraire amount
    function viewNumeraireAmount(uint256 _amount) external view override returns (int128 amount_) {
        uint256 _rate = getRate();

        amount_ = ((_amount * _rate).div(1e8)).divu(DECIMALS);
    }

    // views the numeraire value of the current balance of the reserve, in this case aud
    function viewNumeraireBalance(address _addr) external view override returns (int128 balance_) {
        uint256 _rate = getRate();

        uint256 _balance = aud.balanceOf(_addr);

        if (_balance <= 0) return ABDKMath64x64.fromUInt(0);

        balance_ = ((_balance * _rate).div(1e8)).divu(DECIMALS);
    }

    // views the numeraire value of the current balance of the reserve, in this case aud
    function viewNumeraireAmountAndBalance(address _addr, uint256 _amount)
        external
        view
        override
        returns (int128 amount_, int128 balance_)
    {
        uint256 _rate = getRate();

        amount_ = ((_amount * _rate).div(1e8)).divu(DECIMALS);

        uint256 _balance = aud.balanceOf(_addr);

        balance_ = ((_balance * _rate).div(1e8)).divu(DECIMALS);
    }

    // views the numeraire value of the current balance of the reserve, in this case aud
    // instead of calculating with chainlink's "rate" it'll be determined by the existing
    // token ratio. This is in here to prevent LPs from losing out on future oracle price updates
    function viewNumeraireBalanceLPRatio(
        uint256 _baseWeight,
        uint256 _quoteWeight,
        address _addr
    ) external view override returns (int128 balance_) {
        uint256 _audBal = aud.balanceOf(_addr);

        if (_audBal <= 0) return ABDKMath64x64.fromUInt(0);

        uint256 _usdcBal = usdc.balanceOf(_addr).mul(DECIMALS).div(_quoteWeight);

        // Rate is in 1e6
        uint256 _rate = _usdcBal.mul(DECIMALS).div(_audBal.mul(DECIMALS).div(_baseWeight));

        balance_ = ((_audBal * _rate).div(1e6)).divu(DECIMALS);
    }
}
