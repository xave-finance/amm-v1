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

contract EursToUsdAssimilator is IAssimilator {
    using ABDKMath64x64 for int128;
    using ABDKMath64x64 for uint256;

    using SafeMath for uint256;

    // Mainnet
    IOracle private constant oracle = IOracle(0xb49f677943BC038e9857d61E7d053CaA2C1734C1);
    IERC20 private constant usdc = IERC20(0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48);
    IERC20 private constant eurs = IERC20(0xdB25f211AB05b1c97D595516F45794528a807ad8);

    // // Kovan
    // IOracle private constant oracle = IOracle(0x0c15Ab9A0DB086e062194c273CC79f41597Bbf13);
    // IERC20 private constant usdc = IERC20(0x12513dd17Ae75AF37d9eb21124f98b04705Be906);
    // IERC20 private constant eurs = IERC20(0x7bcFAF04C9BAD18e3A823740E0683A36426BB0Fe);

    // // Matic
    // IOracle private constant oracle = IOracle(0x73366Fe0AA0Ded304479862808e02506FE556a98);
    // IERC20 private constant usdc = IERC20(0x61410450256785735096baEB270407457dB91EC5);
    // IERC20 private constant eurs = IERC20(0xd9922048957d37511C3Aa02ADA3f3eaC16D9b9Df);

    uint256 private constant DECIMALS = 1e2;

    function getRate() public view override returns (uint256) {
        (, int256 price, , , ) = oracle.latestRoundData();
        return uint256(price);
    }

    // takes raw eurs amount, transfers it in, calculates corresponding numeraire amount and returns it
    function intakeRawAndGetBalance(uint256 _amount) external override returns (int128 amount_, int128 balance_) {
        bool _transferSuccess = eurs.transferFrom(msg.sender, address(this), _amount);

        require(_transferSuccess, "Curve/EURS-transfer-from-failed");

        uint256 _balance = eurs.balanceOf(address(this));

        uint256 _rate = getRate();

        balance_ = ((_balance.mul(_rate)).div(1e8)).divu(DECIMALS);

        amount_ = ((_amount.mul(_rate)).div(1e8)).divu(DECIMALS);
    }

    // takes raw eurs amount, transfers it in, calculates corresponding numeraire amount and returns it
    function intakeRaw(uint256 _amount) external override returns (int128 amount_) {
        bool _transferSuccess = eurs.transferFrom(msg.sender, address(this), _amount);

        require(_transferSuccess, "Curve/eurs-transfer-from-failed");

        uint256 _rate = getRate();

        amount_ = ((_amount.mul(_rate)).div(1e8)).divu(DECIMALS);
    }

    // takes a numeraire amount, calculates the raw amount of eurs, transfers it in and returns the corresponding raw amount
    function intakeNumeraire(int128 _amount) external override returns (uint256 amount_) {
        uint256 _rate = getRate();

        amount_ = (_amount.mulu(DECIMALS).mul(1e8)).div(_rate);

        bool _transferSuccess = eurs.transferFrom(msg.sender, address(this), amount_);

        require(_transferSuccess, "Curve/EURS-transfer-from-failed");
    }

    // takes a numeraire amount, calculates the raw amount of eurs, transfers it in and returns the corresponding raw amount
    function intakeNumeraireLPRatio(
        uint256 _baseWeight,
        uint256 _quoteWeight,
        address _addr,
        int128 _amount
    ) external override returns (uint256 amount_) {
        uint256 _eursBal = eurs.balanceOf(_addr);

        if (_eursBal <= 0) return 0;

        // DECIMALS
        _eursBal = _eursBal.mul(1e18).div(_baseWeight);

        // 1e6
        uint256 _usdcBal = usdc.balanceOf(_addr).mul(1e18).div(_quoteWeight);

        // Rate is in 1e6
        uint256 _rate = _usdcBal.mul(DECIMALS).div(_eursBal);

        amount_ = (_amount.mulu(DECIMALS).mul(1e6)).div(_rate);

        bool _transferSuccess = eurs.transferFrom(msg.sender, address(this), amount_);

        require(_transferSuccess, "Curve/EURS-transfer-from-failed");
    }

    // takes a raw amount of eurs and transfers it out, returns numeraire value of the raw amount
    function outputRawAndGetBalance(address _dst, uint256 _amount)
        external
        override
        returns (int128 amount_, int128 balance_)
    {
        uint256 _rate = getRate();

        uint256 _eursAmount = ((_amount).mul(_rate)).div(1e8);

        bool _transferSuccess = eurs.transfer(_dst, _eursAmount);

        require(_transferSuccess, "Curve/EURS-transfer-failed");

        uint256 _balance = eurs.balanceOf(address(this));

        amount_ = _eursAmount.divu(DECIMALS);

        balance_ = ((_balance.mul(_rate)).div(1e8)).divu(DECIMALS);
    }

    // takes a raw amount of eurs and transfers it out, returns numeraire value of the raw amount
    function outputRaw(address _dst, uint256 _amount) external override returns (int128 amount_) {
        uint256 _rate = getRate();

        uint256 _eursAmount = (_amount.mul(_rate)).div(1e8);

        bool _transferSuccess = eurs.transfer(_dst, _eursAmount);

        require(_transferSuccess, "Curve/EURS-transfer-failed");

        amount_ = _eursAmount.divu(DECIMALS);
    }

    // takes a numeraire value of eurs, figures out the raw amount, transfers raw amount out, and returns raw amount
    function outputNumeraire(address _dst, int128 _amount) external override returns (uint256 amount_) {
        uint256 _rate = getRate();

        amount_ = (_amount.mulu(DECIMALS).mul(1e8)).div(_rate);

        bool _transferSuccess = eurs.transfer(_dst, amount_);

        require(_transferSuccess, "Curve/EURS-transfer-failed");
    }

    // takes a numeraire amount and returns the raw amount
    function viewRawAmount(int128 _amount) external view override returns (uint256 amount_) {
        uint256 _rate = getRate();

        amount_ = (_amount.mulu(DECIMALS).mul(1e8)).div(_rate);
    }

    function viewRawAmountLPRatio(
        uint256 _baseWeight,
        uint256 _quoteWeight,
        address _addr,
        int128 _amount
    ) external view override returns (uint256 amount_) {
        uint256 _eursBal = eurs.balanceOf(_addr);

        if (_eursBal <= 0) return 0;

        // DECIMALS
        _eursBal = _eursBal.mul(1e18).div(_baseWeight);

        // 1e6
        uint256 _usdcBal = usdc.balanceOf(_addr).mul(1e18).div(_quoteWeight);

        // Rate is in 1e6
        uint256 _rate = _usdcBal.mul(DECIMALS).div(_eursBal);

        amount_ = (_amount.mulu(DECIMALS).mul(1e6)).div(_rate);
    }

    // takes a raw amount and returns the numeraire amount
    function viewNumeraireAmount(uint256 _amount) external view override returns (int128 amount_) {
        uint256 _rate = getRate();

        amount_ = ((_amount.mul(_rate)).div(1e8)).divu(DECIMALS);
    }

    // views the numeraire value of the current balance of the reserve, in this case eurs
    function viewNumeraireBalance(address _addr) external view override returns (int128 balance_) {
        uint256 _rate = getRate();

        uint256 _balance = eurs.balanceOf(_addr);

        if (_balance <= 0) return ABDKMath64x64.fromUInt(0);

        balance_ = ((_balance.mul(_rate)).div(1e8)).divu(DECIMALS);
    }

    // views the numeraire value of the current balance of the reserve, in this case eurs
    function viewNumeraireAmountAndBalance(address _addr, uint256 _amount)
        external
        view
        override
        returns (int128 amount_, int128 balance_)
    {
        uint256 _rate = getRate();

        amount_ = ((_amount.mul(_rate)).div(1e8)).divu(DECIMALS);

        uint256 _balance = eurs.balanceOf(_addr);

        balance_ = ((_balance.mul(_rate)).div(1e8)).divu(DECIMALS);
    }

    // views the numeraire value of the current balance of the reserve, in this case eurs
    // instead of calculating with chainlink's "rate" it'll be determined by the existing
    // token ratio. This is in here to prevent LPs from losing out on future oracle price updates
    function viewNumeraireBalanceLPRatio(
        uint256 _baseWeight,
        uint256 _quoteWeight,
        address _addr
    ) external view override returns (int128 balance_) {
        uint256 _eursBal = eurs.balanceOf(_addr);

        if (_eursBal <= 0) return ABDKMath64x64.fromUInt(0);

        uint256 _usdcBal = usdc.balanceOf(_addr).mul(1e18).div(_quoteWeight);

        // Rate is in 1e6
        uint256 _rate = _usdcBal.mul(1e18).div(_eursBal.mul(1e18).div(_baseWeight));

        balance_ = ((_eursBal.mul(_rate)).div(1e6)).divu(1e18);
    }
}
