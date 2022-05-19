// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

contract Bank {
    address public admin;
    mapping(address => uint) public customers;
    mapping (uint => address) public pendingCustomers;
    mapping (address => bool) public acceptedCustomers;
    mapping(address => uint256) balances;
    uint totalSupply_;
    string private _name;
    string private _symbol;
    uint8 private _decimal;
    event Transfer(address from, address to, uint value);
    uint public numberOfCustomers=0; 
    
 
    constructor (string memory name, string memory symbol) {
        _name = name;
        _symbol = symbol;
        admin = msg.sender;
    }

    // bank part

    function deposit() public payable {
       require(acceptedCustomers[msg.sender]);
       customers[msg.sender] += msg.value; 
    }

    function openAccount() public payable {
 
        pendingCustomers[numberOfCustomers] = msg.sender;
        numberOfCustomers++;
    }

    function acceptCustomers(address go, uint index) public{
        require(msg.sender == admin);
           acceptedCustomers[go] = true;
           pendingCustomers[index] = address(0);
    }

   function createAccount() public payable {
        require(msg.value > .01 ether);
        require(acceptedCustomers[msg.sender]);
        customers[msg.sender] = msg.value;
    } 

     function withDraw(uint money) public payable {
        require(acceptedCustomers[msg.sender]);
        require(customers[msg.sender] >= money);
        payable(msg.sender).transfer(money);
        customers[msg.sender] = customers[msg.sender] - money;
    }

    function balance() public view returns (uint) {
        return customers[msg.sender];
    }

    function getSummary() public view returns (uint) {
        return (
            balance()
        );
    }

}