require('dotenv').config();

const {MNEMONIC, PROJECT_ID } = process.env;
const HDWalletProvider = require("@truffle/hdwallet-provider");

module.exports = {

    networks: {

        // Ganache:
        development: {
            host: "127.0.0.1",
            port: 7545,
            network_id: "5777"
        },

        sepolia: {
            provider: () => new HDWalletProvider(MNEMONIC, `https://sepolia.infura.io/v3/${PROJECT_ID}`),
            network_id: 11155111,
            gas: 4_000_000
        }
    },

    compilers: {
        solc: {
            version: "^0.8.18"
        }
    }
};
