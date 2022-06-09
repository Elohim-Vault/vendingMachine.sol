//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract VendingMachine {
    address private owner;
    Product[] private repository;

    struct Product {
        string name;
        uint quantity;
        uint price;
    }

    event productAdded(string productName);

    modifier OnlyOwner {
        require(msg.sender == owner, "Only owner should do this.");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function addProduct(string calldata name, uint price) public OnlyOwner {
        Product memory newProduct = Product(name, 5, price);
        repository.push(newProduct);
        emit productAdded(name);
    }
}