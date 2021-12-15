// SPDX-License-Identifier: MIT
pragma solidity ^0.7.3;

contract MockAggregator {
    // CAD
    // uint80 public _roundId = 36893488147419104275;
    // int256 public _answer = 77714900;
    // uint256 public _startedAt = 1639560117;
    // uint256 public _updatedAt = 1639560117;
    // uint80 public _answeredInRound = 36893488147419104275;

    // SGD
    uint80 public _roundId = 18446744073709552100;
    int256 public _answer = 73116255;
    uint256 public _startedAt = 1639553135;
    uint256 public _updatedAt = 1639553135;
    uint80 public _answeredInRound = 18446744073709552100;

    function setAnswer(int256 _a) external {
        _answer = _a;
    }

    function latestAnswer() external view returns (int256) {
        return _answer;
    }

    function setLatestRoundData(
        uint80 roundId,
        int256 answer,
        uint256 startedAt,
        uint256 updatedAt,
        uint80 answeredInRound
    ) external {
        _roundId = roundId;
        _answer = answer;
        _startedAt = startedAt;
        _updatedAt = updatedAt;
        _answeredInRound = answeredInRound;
    }

    function latestRoundData()
        external
        view
        returns (
            uint80,
            int256,
            uint256,
            uint256,
            uint80
        )
    {
        return (_roundId, _answer, _startedAt, _updatedAt, _answeredInRound);
    }
}
