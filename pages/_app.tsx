import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import { connectToWallet } from '../utils/web3Client';

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    connectToWallet();
  });
  return <Component {...pageProps} />;
}

export default MyApp;
