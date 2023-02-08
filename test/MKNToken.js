const MKNTokenContract = artifacts.require("MKNToken");

const expectedName = "MKN Token";
const expectedSymbol = "MKN";
const expectedDecimals = 18;
const expectedTotalSupply = "0";

let MKNToken;

contract("MKNToken", (accounts) => {

    before('Setup the new contract instance', async () => {
        MKNToken = await MKNTokenContract.deployed();
    });

    it("Method name() returns the same value according to my individual task from table",  async () => {
        const actualName = await name();

        assert.equal(actualName, expectedName, "Method name() returns wrong value");
    });

    it("Method symbol() returns the same value according to my individual task from table",  async () => {
        const actualSymbol = await symbol();

        assert.equal(actualSymbol, expectedSymbol, "Method symbol() returns wrong value");
    });

    it("Method decimals() returns the same value according to my individual task from table",  async () => {
        const actualDecimals = await decimals();

        assert.equal(actualDecimals, expectedDecimals, "Method decimals() returns wrong value");
    });

    it("Method totalSupply() returns 0",  async () => {
        const actualTotalSupply = await totalSupply();

        assert.equal(actualTotalSupply, expectedTotalSupply, "Method totalSupply() returns wrong value");
    });

    it("Contract creator account has the same tokens amount as method totalSupply() returns",  async () => {
        const contractAccount =  accounts[0];

        const actualTotalSupply = await totalSupply();
        const contractAccountBalance = await balanceOf(contractAccount);

        assert.equal(actualTotalSupply, contractAccountBalance, "Contract creator account has different tokens amount from totalSupply() value");
    });

    it("After execution of transfer() sender's balance is correctly reduced and receiver's balance is increased",  async () => {
        const sendAmount = 1000;
        const senderAccount =  accounts[0];
        const receiverAccount = accounts[1];
        await mint(3000);

        const senderBalanceBefore = await balanceOf(senderAccount);
        const receiverBalanceBefore = await balanceOf(receiverAccount);

        await transfer(receiverAccount, sendAmount);

        const senderBalanceAfter = await balanceOf(senderAccount);
        const receiverBalanceAfter = await balanceOf(receiverAccount);

        assert.equal(senderBalanceAfter, senderBalanceBefore - sendAmount, "Sender's balance is not correctly reduced");
        assert.equal(receiverBalanceAfter, +receiverBalanceBefore + sendAmount, "Receiver's balance is not correctly increased");
    });

    it("After execution of approve() value of allowance() for receiver is updated correctly",  async () => {
        const ownerAccount = accounts[0];
        const spenderAccount = accounts[1];
        const allowanceAmount = 2000;

        await approve(spenderAccount, allowanceAmount);
        const spenderAllowance = await allowance(ownerAccount, spenderAccount);

        assert.equal(spenderAllowance, allowanceAmount, "Value of allowance() for receiver is not updated correctly");
    });

    it("After execution of transferFrom() sender's balance is correctly reduced and receiver's balance is increased",  async () => {
        const senderAccount = accounts[0];
        const receiverAccount = accounts[1];
        const allowanceAmount = 2000;
        await mint(3000);

        const senderBalanceBefore = await balanceOf(senderAccount);
        const receiverBalanceBefore = await balanceOf(receiverAccount);

        await approve(receiverAccount, allowanceAmount);
        await transferFrom(senderAccount, receiverAccount, allowanceAmount, receiverAccount);

        const senderBalanceAfter = await balanceOf(senderAccount);
        const receiverBalanceAfter = await balanceOf(receiverAccount);

        assert.equal(senderBalanceAfter, senderBalanceBefore - allowanceAmount, "Sender's balance is not correctly reduced");
        assert.equal(receiverBalanceAfter, +receiverBalanceBefore + allowanceAmount, "Receiver's balance is not correctly increased");
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