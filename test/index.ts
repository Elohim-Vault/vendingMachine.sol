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
        await expect(vending.addProduct("Sprite Soda", 2))
            .to
            .emit(vending, "productAdded");
    });

    it("Should fail to add a product when address different from owner.", async () => {
        const accounts = await ethers.getSigners();
        await expect(vending.connect(accounts[1]).addProduct("Sprite Soda", 2))
            .to
            .be
            .revertedWith("Only owner should do this.");
    })
})