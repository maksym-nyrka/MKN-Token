const { deployProxy } = require('@openzeppelin/truffle-upgrades');

const MKNTokenContract = artifacts.require("MKNToken");

const expectedName = "MKN Token";
const expectedSymbol = "MKN";
const expectedDecimals = 18;
const expectedTotalSupply = "0";

let MKNToken;

contract("MKNToken", (accounts) => {

    beforeEach('setup the new contract instance', async () => {
        MKNToken = await deployProxy(MKNTokenContract);
    });

    it("Method name() returns the same value according to my individual task from table",  async () => {
        MKNToken = await MKNTokenContract.deployed();

        assert.equal(await name(), expectedName, "Method name() returns wrong value");
    });

    it("Method symbol() returns the same value according to my individual task from table",  async () => {
        MKNToken = await MKNTokenContract.deployed();

        assert.equal(await symbol(), expectedSymbol, "Method symbol() returns wrong value");
    });

    it("Method decimals() returns the same value according to my individual task from table",  async () => {
        MKNToken = await MKNTokenContract.deployed();

        assert.equal(await decimals(), expectedDecimals, "Method decimals() returns wrong value");
    });

    it("Method totalSupply() returns 0",  async () => {
        MKNToken = await MKNTokenContract.deployed();

        const actualTotalSupply = await totalSupply();
        assert.equal(actualTotalSupply, expectedTotalSupply, "Method totalSupply() returns wrong value");
    });

    it("Contract creator account has the same tokens amount as method totalSupply() returns",  async () => {
        MKNToken = await MKNTokenContract.deployed();
        const contractAccount =  accounts[0];

        const actualTotalSupply = await totalSupply();
        const contractAccountBalance = await balanceOf(contractAccount);

        assert.equal(actualTotalSupply, contractAccountBalance, "Contract creator account has different tokens amount from totalSupply() value");
    });

    it("After execution of transfer() sender's balance is correctly reduced and receiver's balance is increased",  async () => {
        const mintAmount = 3000;
        const sendAmount = 1000;
        const expectedSenderBalance =  mintAmount - sendAmount;

        MKNToken = await MKNTokenContract.deployed();
        const senderAccount =  accounts[0];
        const receiverAccount = accounts[1];
        await mint(mintAmount);

        await transfer(receiverAccount, sendAmount);
        const senderBalance = await balanceOf(senderAccount);
        const receiverBalance = await balanceOf(receiverAccount);

        assert.equal(senderBalance, expectedSenderBalance, "Sender's balance is not correctly reduced");
        assert.equal(receiverBalance, sendAmount, "Receiver's balance is not correctly increased");
    });

    it("After execution of approve() value of allowance() for receiver is updated correctly",  async () => {
        MKNToken = await MKNTokenContract.deployed();
        const ownerAccount = accounts[0];
        const spenderAccount = accounts[1];
        const allowanceAmount = 2000;

        await approve(spenderAccount, allowanceAmount);
        const spenderAllowance = await allowance(ownerAccount, spenderAccount);

        assert.equal(spenderAllowance, allowanceAmount, "Value of allowance() for receiver is not updated correctly");
    });

    //1. Test atomicity (balances, allowances are left from previous tests)
    it("After execution of transferFrom() sender's balance is correctly reduced and receiver's balance is increased",  async () => {
        MKNToken = await MKNTokenContract.new();
        MKNToken = await MKNTokenContract.deployed();
        const senderAccount = accounts[0];
        const receiverAccount = accounts[1];
        const allowanceAmount = 2000;

        let senderBalance = await balanceOf(senderAccount);
        let receiverBalance = await balanceOf(receiverAccount);
        console.log(senderBalance)
        console.log(receiverBalance)

        await mint(allowanceAmount);
        await approve(receiverAccount, allowanceAmount);
        await transferFrom(senderAccount, receiverAccount, allowanceAmount, receiverAccount);

         senderBalance = await balanceOf(senderAccount);
         receiverBalance = await balanceOf(receiverAccount);
        console.log(senderBalance)
        console.log(receiverBalance)

        assert.equal(senderBalance, 0, "Sender's balance is not correctly reduced");
        assert.equal(receiverBalance, allowanceAmount, "Receiver's balance is not correctly increased");
    });
});

async function name() {
    return await MKNToken.name();
}

async function symbol() {
    return await MKNToken.symbol();
}

async function decimals() {
    return await MKNToken.decimals();
}

async function totalSupply() {
    return String(await MKNToken.totalSupply());
}

async function balanceOf(address) {
    return String(await MKNToken.balanceOf(address));
}

async function transfer(to, amount) {
    return await MKNToken.transfer(to, amount);
}

async function mint(amount) {
    return await MKNToken.mint(amount);
}

async function approve(spender, amount) {
    return await MKNToken.approve(spender, amount);
}

async function allowance(owner, spender) {
    return String(await MKNToken.allowance(owner, spender));
}

async function transferFrom(from, to, amount, caller) {
    return String(await MKNToken.transferFrom(from, to, amount, {from: caller}));
}