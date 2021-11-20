// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal {
    
    uint totalWaves;
    uint private seed;

    event NewWave(address indexed from,uint256 timestamp, string message);

    //adding cooldown period for an hour
    mapping(address => uint) public lastWaved;

    struct WaveMessage{
        address sender;
        string message;
        uint256 timestamp;
    }

    WaveMessage[] waves;

    constructor() payable{
        console.log("Hey Medha here!");

        seed = (block.timestamp + block.difficulty)%100;
    }

    function wave(string memory _message) public{

        require( 
            lastWaved[msg.sender] + 59 minutes < block.timestamp,
            "You can wave after an hour"
        );

        lastWaved[msg.sender] = block.timestamp;

        totalWaves+=1;
        console.log("%s has waved",msg.sender);

        waves.push(WaveMessage(msg.sender,_message, block.timestamp));
        seed = (block.timestamp + block.difficulty + seed)%100;

        if(seed<=50){
            console.log("%s won!", msg.sender);
            uint256 prizeAmount = 0.0001 ether;
            require(
                prizeAmount <= address(this).balance,
                "Trying to withdraw more money than the contract has."
            );
            (bool success, ) = (msg.sender).call{value: prizeAmount}("");
            require(success, "Failed to withdraw money from contract.");
        }

        emit NewWave(msg.sender, block.timestamp, _message);
    }

    function getAllmessages() public view returns(WaveMessage[] memory){
        return waves;
    }

    function getTotalWaves() public view returns (uint){
        console.log("Total Waves %d", totalWaves);
        return totalWaves;
    }
}