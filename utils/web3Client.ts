import Web3 from 'web3';
import type { AbiItem } from 'web3-utils';
import type { Contract } from 'web3-eth-contract';
import { NET_ID, RPC_URL, fetchIpfs } from './helpers';
import { create as ipfsHttpClient } from 'ipfs-http-client';
const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0');

export const connectToWallet = async () => {
  if (window.ethereum) {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    try {
      const isUnlocked = await window.ethereum._metamask.isUnlocked();
      if (!isUnlocked) throw new Error('Wallet Locked!');
      const web3 = new Web3(window.ethereum);
      const account = (await web3.eth.getAccounts())[0];
      const netId = await web3.eth.net.getId();
      if (netId !== NET_ID)
        alert('Wrong network, please switch to the Matic Mumbai testnet!');
      else {
        return account;
      }
    } catch (e) {
      alert(e);
    }
  } else {
    alert('web3 not detected');
  }
};

export const addService = async (url: string) => {
  console.log(`Service with ${url} is being stored to polygon`);

  alert('Service Added');
};
