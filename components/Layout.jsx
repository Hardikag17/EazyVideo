import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { EazyVideoContext } from '../utils/eazyVideoContext';

const Layout = ({ children }) => {
  // const history = useHistory();
  // const location = useLocation();

  const [state, setState] = useState({
    account: '',
    loaded: false,
    web3: null,
    NFTContract: null,
    EazyVideoContract: null,
  });

  useEffect(() => {
    if (!state.loaded) {
      alert('wallet not connected');
      // history.push('/');
    }
  }, [state]);

  return (
    <EazyVideoContext.Provider value={{ state, setState }}>
      <div>{children}</div>
    </EazyVideoContext.Provider>
  );
};

export default Layout;
