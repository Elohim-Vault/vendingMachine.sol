//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract VendingMachine {
    uint256 private totalProducts;
    uint256 private availableWei;
    address payable private owner;
    Product[] public repository;

    struct Product {
        uint256 id;
        string name;
        uint256 quantity;
        uint256 price;
    }

    event added(string productName);
    event sold(string productName, uint256 amount, address buyer);

    modifier OnlyOwner() {
        require(msg.sender == owner, "Only owner should do this.");
        _;
    }

    constructor() {
        owner = payable(msg.sender);
        totalProducts = 0;
        availableWei = 0;
    }

    function add(string calldata name, uint256 price) public OnlyOwner {
        totalProducts++;
        Product memory newProduct = Product(totalProducts, name, 5, price);
        repository.push(newProduct);
        emit added(name);
    }

    function buy(uint256 id, uint256 amount) public payable {
        for (uint256 i = 0; i < repository.length; i++) {
            Product memory product = repository[i];
            if (product.id == id) {
                require(
                    amount <= product.quantity,
                    "Try to buy more then available."
                );
                require(msg.value >= product.price, "Incorret wei value sent.");

                owner.transfer(product.price);
                availableWei += amount;
                repository[i].quantity -= amount;

                emit sold(product.name, amount, msg.sender);
                return;
            }
        }
        revert("Product not found.");
    }
}
