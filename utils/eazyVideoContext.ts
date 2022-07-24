import { createContext } from 'react';
interface EazyVideoContextInterface {
  account: string;
  walletConnected: boolean;
  web3: string;
  SubsNFTContract: string;
  EazyVideoContract: string;
  accountType: boolean;
}

export const initialState = {
  account: '',
  walletConnected: null,
  web3: '',
  SubsNFTContract: '',
  EazyVideoContract: '',
  accountType: null,
};

export const EazyVideoContext = createContext<EazyVideoContextInterface | null>(
  null
);
