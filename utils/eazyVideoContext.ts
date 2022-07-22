import { createContext } from 'react';
interface EazyVideoContextInterface {
  account: string;
  loaded: boolean;
}

export const EazyVideoContext = createContext<EazyVideoContextInterface | null>(
  null
);
