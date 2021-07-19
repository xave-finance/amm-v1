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

import "../../lib/ABDKMath64x64.sol";
import "../../interfaces/IAssimilator.sol";
import "../../interfaces/IOracle.sol";

contract ChfToUsdAssimilator is IAssimilator {
    using ABDKMath64x64 for int128;
    using ABDKMath64x64 for uint256;

    using SafeMath for uint256;

    // Kovan
    IOracle private constant oracle = IOracle(0xed0616BeF04D374969f302a34AE4A63882490A8C);
    IERC20 private constant usdc = IERC20(0x72a97313cF25FDFdb1CeCD597CC12809c9851Ca0);
    IERC20 private constant chf = IERC20(0x6E4E54419957c386bF089b99849D1e1c923446DE);

    // solhint-disable-next-line
    constructor() {}

    function getRate() public view override returns (uint256) {
        (, int256 price, , , ) = oracle.latestRoundData();
        return uint256(price);
    }

    // takes raw chf amount, transfers it in, calculates corresponding numeraire amount and returns it
    function intakeRawAndGetBalance(uint256 _amount) external override returns (int128 amount_, int128 balance_) {
        bool _transferSuccess = chf.transferFrom(msg.sender, address(this), _amount);

        require(_transferSuccess, "Curve/CHF-transfer-from-failed");

        uint256 _balance = chf.balanceOf(address(this));

        uint256 _rate = getRate();

        balance_ = ((_balance * _rate) / 1e8).divu(1e2);

        amount_ = ((_amount * _rate) / 1e8).divu(1e2);
    }

    // takes raw chf amount, transfers it in, calculates corresponding numeraire amount and returns it
    function intakeRaw(uint256 _amount) external override returns (int128 amount_) {
        bool _transferSuccess = chf.transferFrom(msg.sender, address(this), _amount);

        require(_transferSuccess, "Curve/chf-transfer-from-failed");

        uint256 _rate = getRate();

        amount_ = ((_amount * _rate) / 1e8).divu(1e2);
    }

    // takes a numeraire amount, calculates the raw amount of chf, transfers it in and returns the corresponding raw amount
    function intakeNumeraire(int128 _amount) external override returns (uint256 amount_) {
        uint256 _rate = getRate();

        amount_ = (_amount.mulu(1e2) * 1e8) / _rate;

        bool _transferSuccess = chf.transferFrom(msg.sender, address(this), amount_);

        require(_transferSuccess, "Curve/CHF-transfer-from-failed");
    }

    // takes a numeraire amount, calculates the raw amount of chf, transfers it in and returns the corresponding raw amount
    function intakeNumeraireLPRatio(
        uint256 _baseWeight,
        uint256 _quoteWeight,
        address _addr,
        int128 _amount
    ) external override returns (uint256 amount_) {
        uint256 _chfBal = chf.balanceOf(_addr);

        if (_chfBal <= 0) return 0;

        // 1e2
        _chfBal = _chfBal.mul(1e18).div(_baseWeight);

        // 1e6
        uint256 _usdcBal = usdc.balanceOf(_addr).mul(1e18).div(_quoteWeight);

        // Rate is in 1e6
        uint256 _rate = _usdcBal.mul(1e2).div(_chfBal);

        amount_ = (_amount.mulu(1e2) * 1e6) / _rate;

        bool _transferSuccess = chf.transferFrom(msg.sender, address(this), amount_);

        require(_transferSuccess, "Curve/CHF-transfer-from-failed");
    }

    // takes a raw amount of chf and transfers it out, returns numeraire value of the raw amount
    function outputRawAndGetBalance(address _dst, uint256 _amount)
        external
        override
        returns (int128 amount_, int128 balance_)
    {
        uint256 _rate = getRate();

        uint256 _chfAmount = ((_amount) * _rate) / 1e8;

        bool _transferSuccess = chf.transfer(_dst, _chfAmount);

        require(_transferSuccess, "Curve/CHF-transfer-failed");

        uint256 _balance = chf.balanceOf(address(this));

        amount_ = _chfAmount.divu(1e2);

        balance_ = ((_balance * _rate) / 1e8).divu(1e2);
    }

    // takes a raw amount of chf and transfers it out, returns numeraire value of the raw amount
    function outputRaw(address _dst, uint256 _amount) external override returns (int128 amount_) {
        uint256 _rate = getRate();

        uint256 _chfAmount = (_amount * _rate) / 1e8;

        bool _transferSuccess = chf.transfer(_dst, _chfAmount);

        require(_transferSuccess, "Curve/CHF-transfer-failed");

        amount_ = _chfAmount.divu(1e2);
    }

    // takes a numeraire value of chf, figures out the raw amount, transfers raw amount out, and returns raw amount
    function outputNumeraire(address _dst, int128 _amount) external override returns (uint256 amount_) {
        uint256 _rate = getRate();

        amount_ = (_amount.mulu(1e2) * 1e8) / _rate;

        bool _transferSuccess = chf.transfer(_dst, amount_);

        require(_transferSuccess, "Curve/CHF-transfer-failed");
    }

    // takes a numeraire amount and returns the raw amount
    function viewRawAmount(int128 _amount) external view override returns (uint256 amount_) {
        uint256 _rate = getRate();

        amount_ = (_amount.mulu(1e2) * 1e8) / _rate;
    }

    function viewRawAmountLPRatio(
        uint256 _baseWeight,
        uint256 _quoteWeight,
        address _addr,
        int128 _amount
    ) external view override returns (uint256 amount_) {
        uint256 _chfBal = chf.balanceOf(_addr);

        if (_chfBal <= 0) return 0;

        // 1e2
        _chfBal = _chfBal.mul(1e18).div(_baseWeight);

        // 1e6
        uint256 _usdcBal = usdc.balanceOf(_addr).mul(1e18).div(_quoteWeight);

        // Rate is in 1e6
        uint256 _rate = _usdcBal.mul(1e2).div(_chfBal);

        amount_ = (_amount.mulu(1e2) * 1e6) / _rate;
    }

    // takes a raw amount and returns the numeraire amount
    function viewNumeraireAmount(uint256 _amount) external view override returns (int128 amount_) {
        uint256 _rate = getRate();

        amount_ = ((_amount * _rate) / 1e8).divu(1e2);
    }

    // views the numeraire value of the current balance of the reserve, in this case chf
    function viewNumeraireBalance(address _addr) external view override returns (int128 balance_) {
        uint256 _rate = getRate();

        uint256 _balance = chf.balanceOf(_addr);

        if (_balance <= 0) return ABDKMath64x64.fromUInt(0);

        balance_ = ((_balance * _rate) / 1e8).divu(1e2);
    }

    // views the numeraire value of the current balance of the reserve, in this case chf
    function viewNumeraireAmountAndBalance(address _addr, uint256 _amount)
        external
        view
        override
        returns (int128 amount_, int128 balance_)
    {
        uint256 _rate = getRate();

        amount_ = ((_amount * _rate) / 1e8).divu(1e2);

        uint256 _balance = chf.balanceOf(_addr);

        balance_ = ((_balance * _rate) / 1e8).divu(1e2);
    }

    // views the numeraire value of the current balance of the reserve, in this case chf
    // instead of calculating with chainlink's "rate" it'll be determined by the existing
    // token ratio. This is in here to prevent LPs from losing out on future oracle price updates
    function viewNumeraireBalanceLPRatio(
        uint256 _baseWeight,
        uint256 _quoteWeight,
        address _addr
    ) external view override returns (int128 balance_) {
        uint256 _chfBal = chf.balanceOf(_addr);

        if (_chfBal <= 0) return ABDKMath64x64.fromUInt(0);

        uint256 _usdcBal = usdc.balanceOf(_addr).mul(1e18).div(_quoteWeight);

        // Rate is in 1e6
        uint256 _rate = _usdcBal.mul(1e18).div(_chfBal.mul(1e18).div(_baseWeight));

        balance_ = ((_chfBal * _rate) / 1e6).divu(1e18);
    }
}
