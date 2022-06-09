//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract VendingMachine {
    uint private totalProducts;
    uint private totalWei;
    address payable private owner;
    Product[] public repository;

    struct Product {
        uint id;
        string name;
        uint quantity;
        uint price;
    }

    event added(string productName);
    event sold(string productName, uint amount, address buyer);

    modifier OnlyOwner {
        require(msg.sender == owner, "Only owner should do this.");
        _;
    }

    constructor() {
        owner = payable(msg.sender);
        totalProducts = 0;
        totalWei = 0;
    }

    function add(string calldata name, uint price) public OnlyOwner {
        totalProducts++;
        Product memory newProduct = Product(totalProducts, name, 5, price);
        repository.push(newProduct);
        emit added(name);
    }

    function sell(uint id, uint amount) public payable {
        for (uint i = 0; i < repository.length; i++) {
            Product memory product = repository[i];
            if (product.id == id) {
                require(amount <= product.quantity, "Try to buy more then available.");
                owner.transfer(product.price);
                totalWei += amount;
                repository[i].quantity -= amount;
                emit sold(product.name, amount, msg.sender);
                return ;
            }
        }
        revert("Product not found.");
    }
}