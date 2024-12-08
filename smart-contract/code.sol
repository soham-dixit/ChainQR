// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Micropayments {
    address public owner;
    mapping(address => uint256) public balances;

    event PaymentReceived(address indexed sender, uint256 amount);
    event PaymentSent(address indexed receiver, uint256 amount);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this operation");
        _;
    }

    function deposit() external payable {
        require(msg.value > 0, "Deposit amount must be greater than zero");
        balances[msg.sender] += msg.value;
        emit PaymentReceived(msg.sender, msg.value);
    }

    function withdraw(uint256 amount) external {
        require(amount > 0, "Withdraw amount must be greater than zero");
        require(balances[msg.sender] >= amount, "Insufficient balance");

        balances[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
        emit PaymentSent(msg.sender, amount);
    }

    function getBalance() external view returns (uint256) {
        return balances[msg.sender];
    }

    function transferTo(address receiver, uint256 amount) external {
        require(receiver != address(0), "Invalid receiver address");
        require(receiver != msg.sender, "You cannot transfer to yourself");
        require(balances[msg.sender] >= amount, "Insufficient balance");

        balances[msg.sender] -= amount;
        balances[receiver] += amount;
        emit PaymentSent(receiver, amount);
    }

    function withdrawAll() external onlyOwner {
        uint256 contractBalance = address(this).balance;
        require(contractBalance > 0, "No balance to withdraw");

        payable(owner).transfer(contractBalance);
    }
}