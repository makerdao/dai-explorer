import Web3 from 'web3';

const web3 = window.web3 ? new Web3(window.web3.currentProvider) : new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
window.web3 = web3;

export default web3;
