import Web3 from 'web3';
import type { AbiItem } from 'web3-utils';
import type { Contract } from 'web3-eth-contract';
import { NET_ID, RPC_URL, notify, fetchIpfs } from './helpers';

export const connectToWallet = async () => {
  console.log('connect to wallet clicked');
  if (window.ethereum) {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      this.web3.setProvider(window.ethereum);
      const netId = await this.web3.eth.net.getId();
      if (netId !== NET_ID) {
        alert('wrong network');
      } else {
        const accountAddress = (await this.web3.eth.getAccounts())[0];
        console.log(accountAddress);
      }
    } catch (e) {
      console.error(e);
      notify('danger', 'Connection error');
    }
  } else notify('danger', 'Wallet not detected');
};
