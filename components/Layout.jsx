import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { EazyVideoContext, initialState } from '../utils/eazyVideoContext';

const Layout = ({ children }) => {
  const router = useRouter();

  const [state, setState] = useState({
    account: '0x0',
    walletConnected: false,
    web3: '',
    SubsNFTContract: '',
    accountType: 0,
  });

  useEffect(() => {
    if (state.loaded == false) {
      alert('wallet not connected');
      router.push('/');
    }
  }, [state, router]);

  return (
    <EazyVideoContext.Provider value={{ state, setState }}>
      <div>{children}</div>
    </EazyVideoContext.Provider>
  );
};

export default Layout;
