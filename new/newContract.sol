// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

contract token {
    address public admin;
    mapping(address => uint256) balances;
    uint totalSupply_;
    string private _name;
    string private _symbol;
    uint8 private _decimal;
    event Transfer(address from, address to, uint value);
    
    constructor (string memory name, string memory symbol) {
        _name = name;
        _symbol = symbol;
        admin = msg.sender;
    }

   function mint(address to, uint amount) external {
        require(msg.sender == admin);
        totalSupply_ += amount;
        balances[to] += amount;
        emit Transfer(msg.sender, to, amount);
    }
    
    function balanceOf() public view returns (uint) {
        return balances[msg.sender];
        
}

    function transfer(address receiver, uint numTokens) public returns (bool) {
  require(numTokens <= balances[msg.sender]);
  balances[msg.sender] -= numTokens;
  balances[receiver] += numTokens;
  emit Transfer(msg.sender, receiver, numTokens);
  return true;
}

    function totalSupply() public view returns (uint256) {
        return totalSupply_;
    }

    function getSummary() public view returns (uint, uint) {
        return (
            balances[msg.sender],
            totalSupply_
        );
    }
}