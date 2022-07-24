//jshint esversion:8
const path = require('path');
const HDWalletProvider = require('@truffle/hdwallet-provider');
require('dotenv').config();
const mnemonic = process.env.MNEMONIC;
const url = process.env.ALCHEMY_POLYGON_MUMBAI_RPC_URL;

module.exports = {
  contracts_build_directory: path.join(__dirname, 'truffle/abis'),
  contracts_directory: path.join(__dirname, 'truffle/contracts'),
  migrations_directory: path.join(__dirname, 'truffle/migrations'),
  networks: {
    development: {
      host: '127.0.0.1', // Localhost (default: none)
      port: 8545, // Standard Ethereum port (default: none)
      network_id: '*', // Any network (default: none)
    },
    matic: {
      provider: () => {
        return new HDWalletProvider(mnemonic, url);
      },
      network_id: '80001',
    },
    rinkeby: {
      provider: () => {
        return new HDWalletProvider(
          mnemonic,
          `https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161`
        );
      },
      network_id: '4',
      skipDryRun: true,
    },
  },
  compilers: {
    solc: {
      version: '0.8.4',
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};
