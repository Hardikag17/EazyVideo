import { EazyVideoContext } from '../../utils/eazyVideoContext';
import EazyVideoContract from '../../truffle/abis/EazyVideo.json';
import SubsNFTContract from '../../truffle/abis/eazyVideoNFTContract.json';
import { NET_ID, RPC_URL, fetchIpfs } from '../../utils/helpers';
import Web3 from 'web3';
import type { AbiItem } from 'web3-utils';
import type { Contract } from 'web3-eth-contract';
import { useContext } from 'react';
import { useRouter } from 'next/router';
export default function Body() {
  const router = useRouter();
  const { state, setState } = useContext(EazyVideoContext);

  const connectToWallet = async (_accountType: boolean) => {
    if (window.ethereum) {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      try {
        const isUnlocked = await window.ethereum._metamask.isUnlocked();
        if (!isUnlocked) throw new Error('Wallet Locked!');
        const web3 = new Web3(window.ethereum);
        const netId = await web3.eth.net.getId();
        if (netId !== NET_ID)
          alert('Wrong network, please switch to the Matic Mumbai testnet!');
        else {
          const account = (await web3.eth.getAccounts())[0];
          const EazyVideoContractAddress =
            EazyVideoContract.networks[netId].address;
          const SubsNFTContractAddress =
            SubsNFTContract.networks[netId].address;
          const EazyVideo: Contract = new web3.eth.Contract(
            EazyVideoContract.abi as AbiItem[],
            EazyVideoContractAddress
          );
          const SubsNFT: Contract = new web3.eth.Contract(
            SubsNFTContract.abi as AbiItem[],
            SubsNFTContractAddress
          );

          setState({
            account: account,
            walletConnected: true,
            web3: web3,
            SubsNFTContract: SubsNFT,
            EazyVideoContract: EazyVideo,
            accountType: _accountType,
          });

          const accountType = await state.EazyVideoContract.methods
            .login(_accountType)
            .call({
              from: state.account,
            });

          console.log('accountType:', accountType);

          if (accountType == 0 && _accountType == false) {
            router.push('/user');
          } else if (accountType == 1 && _accountType == true) {
            router.push('/serviceprovider');
          } else {
            alert('Something is wrong try selecting right option');
          }
        }
      } catch (e) {
        alert(e);
      }
    } else {
      alert('web3 not detected');
    }
  };

  return (
    <div className=' flex flex-col lg:mx-64 mx-auto lg:my-5 my-24 lg:px-4 lg:w-3/4 w-10/12'>
      <div className=' text-5xl lg:w-3/4 pt-5'>
        Binge watch non-stop premium shows, awesome content from your favorite
        Movies, TV shows, web-series and many more
      </div>
      <div className='text-whiteish py-5 lg:px-2 text-2xl lg:w-3/4 w-full'>
        ~ Just now watching OTT has become affordable for everyone. Pay only
        when you are using the service
      </div>
      <div className=' py-10 z-10 w-full'>
        <h1>Choose your profile type</h1>
        <div className='flex flex-row '>
          <button
            onClick={() => connectToWallet(false)}
            className='bg-purple m-2 hover:scale-105 cursor-pointer hover:brightness-125 rounded-xl lg:px-10 lg:py-3 p-3 text-white font-semibold lg:text-2xl text-xl text-center'>
            User
          </button>
          <button
            onClick={() => connectToWallet(true)}
            className='bg-purple m-2 hover:scale-105 cursor-pointer hover:brightness-125 rounded-xl lg:px-10 lg:py-3 p-3 text-white font-semibold lg:text-2xl text-xl text-center'>
            Service Provider
          </button>
        </div>
      </div>
    </div>
  );
}
