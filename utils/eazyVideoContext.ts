import { createContext, useContext } from 'react';

interface iEazyVideoContextInterface {
  state: EazyVideoContextInterface | null;
  setState: React.Dispatch<
    React.SetStateAction<EazyVideoContextInterface | null>
  >;
}

const initialState = {
  state: null,
  setState: () => {},
};

export const EazyVideoContext =
  createContext<iEazyVideoContextInterface>(initialState);
