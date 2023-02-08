const MKNTokenContract = artifacts.require("MKNToken");

module.exports = async (deployer) => {
    await deployer.deploy(MKNTokenContract);
}