import { ethers } from "hardhat";
import { VendingMachine } from "../typechain";
import { expect } from "chai";

describe("VendingMachine", function () {
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

    it("Should fail to add a product when address different from owner.", async () => {
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

    it("Should revert with not found when try to buy a non-existent product.", async () => {
        await expect(vending.buy(42, 1))
            .to
            .be
            .revertedWith("Product not found.");
    });

    it("Should revert when try to buy more products then available.", async () => {
        await expect(vending.add("Sprite Soda", 2))
        .to
        .emit(vending, "added");

        await expect(vending.buy(1, 6))
            .to
            .be
            .revertedWith("Try to buy more then available.");
    });

    it("Should revert when send less wei then product price.", async () => {
        await expect(vending.add("Sprite Soda", 2))
        .to
        .emit(vending, "added");

    await expect(vending.buy(1, 1, {value: ethers.utils.parseUnits("1", "wei")}))
        .to
        .be
        .revertedWith("Incorret wei value sent.");
    })
})