import { createContext, useContext } from 'react';

export const initialState = {
  account: '0x0',
  walletConnected: false,
  web3: '',
  SubsNFTContract: '',
  accountType: 0,
};

export const EazyVideoContext =
  createContext<EazyVideoContextInterface>(initialState);
