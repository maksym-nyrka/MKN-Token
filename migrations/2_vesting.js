const MKNTokenContract = artifacts.require("MKNToken");
const VestingWalletContract = artifacts.require("VestingWallet");

let MKNToken;
let vestingWallet;

module.exports = async (deployer) => {
    const cap = "7300000000000000000000000";
    const vestingPercentage = "2190000000000000000000000";

    await deployer.deploy(VestingWalletContract,
        "0x3B39Fe1F15Cd587A0B7bDFDB2C91cF3e0ded42a2",
        "1676903061",
        "78840000"
    );

    MKNToken = await MKNTokenContract.deployed();
    vestingWallet = await VestingWalletContract.deployed();

    await mint(cap);
    await transfer(vestingWallet.address, vestingPercentage);

    let oneMonthAmount = await vestedAmount(MKNToken.address, 1679321547);
    let sixMonthsAmount = await vestedAmount(MKNToken.address, 1692537147);
    let thirtyMonthsAmount = await vestedAmount(MKNToken.address, 1755781947);

    console.log("\n\n" +
                "1 month:    " + oneMonthAmount + "\n" +
                "6 month:    " + sixMonthsAmount + "\n" +
                "30+ months: " + thirtyMonthsAmount + "\n");
}

async function mint(amount) {
    try {
        return await MKNToken.mint(amount);
    } catch (e) {
        return e.message;
    }
}

async function transfer(to, amount) {
    return await MKNToken.transfer(to, amount);
}

async function vestedAmount(address, timestamp) {
    return await vestingWallet.methods['vestedAmount(address,uint64)'](address, timestamp);
}