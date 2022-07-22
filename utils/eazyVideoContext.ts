import { createContext } from 'react';
interface EazyVideoContextInterface {
  account: string;
  loaded: boolean;
  web3: string;
  NFTContract: string;
  EazyVideoContract: string;
}

export const EazyVideoContext = createContext<EazyVideoContextInterface | null>(
  null
);
