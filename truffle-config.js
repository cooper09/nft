require('babel-register');
require('babel-polyfill');
require('dotenv').config();

const HDWalletProvider = require("truffle-hdwallet-provider");
const { API_KEY, PRIVATE_KEY } = process.env;

module.exports = {
  networks: {
    ropsten:{
      provider: function(){
        //cooper s - create ropsten wallet for Account: Primary
        return new HDWalletProvider(process.env.PRIVATE_KEY, "https://ropsten.infura.io/v3/"+process.env.API_KEY)
      },
      gasPrice: 25000,
      gas: 3000000,
      network_id:'3'
    },
    rinkeby:{
      provider: function(){
        //cooper s - create ropsten wallet for Account3 only
        return new HDWalletProvider("c70ee88b8015156e2cd54314cf8d3b3f61689843106efef12f2f0f8721e7bb17", "https://rinkeby.infura.io/v3/4cd98623d90d401ca984c02080c6bf72")
      },
      gasPrice: 25000,
      gas: 4712388,
      //gas: 3000000,
      network_id:'4'
    },
    kovan:{
      provider: function(){
        //cooper s - create ropsten wallet for Account3 only
        return new HDWalletProvider(process.env.PRIVATE_KEY, "https://kovan.infura.io/v3/4cd98623d90d401ca984c02080c6bf72")
      },
      gasPrice: 25000,
      //gas: 4712388,
      gas: 3000000,
      network_id:'42'
    },
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
  },
  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',
  compilers: {
    solc: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
}
