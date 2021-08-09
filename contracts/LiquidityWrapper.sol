// // SPDX-License-Identifier: MIT

// // This program is free software: you can redistribute it and/or modify
// // it under the terms of the GNU General Public License as published by
// // the Free Software Foundation, either version 3 of the License, or
// // (at your option) any later version.

// // This program is distributed in the hope that it will be useful,
// // but WITHOUT ANY WARRANTY; without even the implied warranty of
// // MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// // GNU General Public License for more details.

// // You should have received a copy of the GNU General Public License
// // along with this program.  If not, see <http://www.gnu.org/licenses/>.

// pragma solidity ^0.7.3;

// import "./Storage.sol";
// import "./Assimilators.sol";
// import "./lib/ABDKMath64x64.sol";
// import "./ProportionalLiquidity.sol";

// contract ViewLiquidityWrapper {
//     using ABDKMath64x64 for int128;

//     function viewLiquidity(Storage.Curve calldata curve, uint256 deposit)
//         external
//         view
//         returns (uint256 total_, uint256[] memory individual_)
//     {
//         return ProportionalLiquidity.proportionalDeposit(curve, deposit);
//     }
// }
