const MKNTokenContract = artifacts.require("MKNToken");

let MKNToken;
let accounts;
let creatorAccount;

contract("MKNToken", (accounts_) => {

    before("Setup the MKNToken instance", async () => {
        MKNToken = await MKNTokenContract.deployed();
        accounts = accounts_;
        creatorAccount = accounts[0];
    });

    it("Method totalSupply() returns 0",  async () => {
        const actualTotalSupply = await totalSupply();

        assert.equal(actualTotalSupply, 0, "Method totalSupply() returns wrong value");
    });

    it("After executing the transfer() method sender's balance is reduced and receiver's balance is increased correctly",  async () => {
        const sendAmount = 1000;
        const senderAccount =  creatorAccount;
        const receiverAccount = accounts[1];
        await mint(3000);

        const senderBalanceBefore = await balanceOf(senderAccount);
        const receiverBalanceBefore = +await balanceOf(receiverAccount);

        await transfer(receiverAccount, sendAmount);

        const senderBalanceAfter = await balanceOf(senderAccount);
        const receiverBalanceAfter = await balanceOf(receiverAccount);

        assert.equal(senderBalanceAfter, senderBalanceBefore - sendAmount, "Sender's balance is not correctly reduced");
        assert.equal(receiverBalanceAfter, receiverBalanceBefore + sendAmount, "Receiver's balance is not correctly increased");
    });

    it("After executing the approve() method receiver's allowance() is updated correctly",  async () => {
        const ownerAccount = creatorAccount;
        const spenderAccount = accounts[1];
        const allowanceAmount = 2000;

        await approve(spenderAccount, allowanceAmount);
        const spenderAllowance = await allowance(ownerAccount, spenderAccount);

        assert.equal(spenderAllowance, allowanceAmount, "Value of allowance() for receiver is not updated correctly");
    });

    it("After executing the transferFrom() method by user with increased allowance balance, sender's balance is correctly reduced and receiver's balance is increased correctly",  async () => {
        const senderAccount = creatorAccount;
        const receiverAccount = accounts[1];
        const allowanceAmount = 2000;
        await mint(3000);

        const senderBalanceBefore = await balanceOf(senderAccount);
        const receiverBalanceBefore = +await balanceOf(receiverAccount);

        await approve(receiverAccount, allowanceAmount);
        await transferFrom(senderAccount, receiverAccount, allowanceAmount, receiverAccount);

        const senderBalanceAfter = await balanceOf(senderAccount);
        const receiverBalanceAfter = await balanceOf(receiverAccount);

        assert.equal(senderBalanceAfter, senderBalanceBefore - allowanceAmount, "Sender's balance is not reduced correctly");
        assert.equal(receiverBalanceAfter, receiverBalanceBefore + allowanceAmount, "Receiver's balance is not increased correctly");
    });

    it("transferFrom() method cannot be executed by user without increased allowance balance correctly", async () => {
        const senderAccount = creatorAccount;
        const receiverAccount = accounts[1];
        const allowanceAmount = 2000;

        let result = await transferFrom(senderAccount, receiverAccount, allowanceAmount, receiverAccount);

        assert.equal(result, "VM Exception while processing transaction: revert ERC20: insufficient allowance",
            "VM Error message is not displayed");
    });

    it("After executing the burn() method contract creator's balance is reduced correctly", async () => {
        const burnAmount = 2000;
        await mint(3000);

        const creatorBalanceBefore = await balanceOf(creatorAccount);

        await burn(burnAmount);

        const creatorBalanceAfter = await balanceOf(creatorAccount);

        assert.equal(creatorBalanceAfter, creatorBalanceBefore - burnAmount, "Contract creator's balance is not reduced correctly");
    });

    it("_owner address equals to contact creator address", async () => {
        let result = await owner();

        assert.equal(result, creatorAccount, "_owner address does not equal to contact creator address");
    });

    it("_owner is able to mint tokens", async () => {
        const mintAmount = 2000;
        const creatorBalanceBefore = +await balanceOf(creatorAccount);

        await mint(mintAmount, creatorAccount);

        const creatorBalanceAfter = +await balanceOf(creatorAccount);

        assert.equal(creatorBalanceAfter, creatorBalanceBefore + mintAmount, "_owner is able to mint tokens");
    });

    it("Account which is not the creator is not able to mint tokens", async () => {
        let result = await mint(3000, accounts[1]);

        assert.equal(result, "VM Exception while processing transaction: revert Ownable: caller is not the owner",
             "VM Error message is not displayed");
    });

    it("_totalSupply cannot be increased to value more than _cap", async () => {
        const _cap = await cap();

        let result = await mint(_cap + 1000);

        assert.equal(result, "VM Exception while processing transaction: revert ERC20Capped: cap exceeded",
            "VM Error message is not displayed");
    });
});

async function totalSupply() {
    return String(await MKNToken.totalSupply());
}

async function balanceOf(address) {
    return String(await MKNToken.balanceOf(address));
}

async function transfer(to, amount) {
    return await MKNToken.transfer(to, amount);
}

async function mint(amount, caller = creatorAccount) {
    try {
        return await MKNToken.mint(amount, {from: caller});
    } catch (e) {
        return e.message;
    }
}

async function burn(amount) {
    return await MKNToken.burn(amount);
}

async function approve(spender, amount) {
    return await MKNToken.approve(spender, amount);
}

async function allowance(owner, spender) {
    return String(await MKNToken.allowance(owner, spender));
}

async function transferFrom(from, to, amount, caller) {
    try {
        return String(await MKNToken.transferFrom(from, to, amount, {from: caller}));
    } catch (e) {
        return e.message;
    }
}

async function owner() {
    return await MKNToken.owner();
}

async function cap() {
    return await MKNToken.cap();
}