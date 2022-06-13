import { ethers } from "hardhat";
import { VendingMachine } from "../typechain";
import { expect } from "chai";

describe("Vending machine smart contract tests", function () {
    let vending: VendingMachine;
    beforeEach(async () => {
        const Vending = await ethers.getContractFactory("VendingMachine");
        vending = await Vending.deploy();
        await vending.deployed();
    });

    it("Should add a product.", async () => {
        await expect(vending.add("Sprite Soda", 2))
            .to
            .emit(vending, "added");
    });

    it("Should revert when to try to add a product with address different from the owner.", async () => {
        const accounts = await ethers.getSigners();
        await expect(vending.connect(accounts[1]).add("Sprite Soda", 2))
            .to
            .be
            .revertedWith("Only owner should do this.");
    })

    it("Should buy a product.", async () => {
        await expect(vending.add("Sprite Soda", 2))
            .to
            .emit(vending, "added");

        await expect(vending.buy(1, 1, {value: ethers.utils.parseUnits("3", "wei")}))
            .to
            .be
            .emit(vending, "sold");
    });

    it("Should revert with not found when to try to buy a non-existent product.", async () => {
        await expect(vending.buy(42, 1))
            .to
            .be
            .revertedWith("Product not found.");
    });

    it("Should revert when to try to buy more products than available.", async () => {
        await expect(vending.add("Sprite Soda", 2))
        .to
        .emit(vending, "added");

        await expect(vending.buy(1, 6))
            .to
            .be
            .revertedWith("Try to buy more then available.");
    });

    it("Should revert when to send less wei than the product price.", async () => {
        await expect(vending.add("Sprite Soda", 2))
        .to
        .emit(vending, "added");

    await expect(vending.buy(1, 1, {value: ethers.utils.parseUnits("1", "wei")}))
        .to
        .be
        .revertedWith("Incorret wei value sent.");
    })
})