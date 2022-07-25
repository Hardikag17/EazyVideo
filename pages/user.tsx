import Navbar from '../components/Navbar/navbar';
import Footer from '../components/Footer/footer';
import Service from '../components/User/BuyCard';
import { useState, useContext } from 'react';
import LendCard from '../components/User/LendCard';
import RentCard from '../components/User/RentCard';

import { EazyVideoContext } from '../utils/eazyVideoContext';

export default function User() {
  const [link, setLink] = useState(<Service />);
  const { state } = useContext(EazyVideoContext);

  const Bag = async () => {
    console.log('fetch user services');
    try {
      if (!state.walletConnected) throw new Error('Not connected to wallet');
    } catch (e) {
      alert(e);
    }
  };

  return (
    <div className=' h-screen'>
      <Navbar />
      <div className=' flex lg:flex-row flex-col mx-auto lg:px-4 lg:w-5/6 w-full m-2 justify-start'>
        <div className='lg:w-1/6 flex flex-col w-full  items-center'>
          <div className=' w-full m-1 flex lg:flex-col flex-row justify-around'>
            <button
              onClick={() => setLink(<LendCard />)}
              className='bg-purple m-2 cursor-pointer hover:brightness-125 rounded-xl lg:px-10 lg:py-3 p-3 text-white font-semibold lg:text-2xl text-lg text-center'>
              Bag
            </button>
            <button
              onClick={() => setLink(<Service />)}
              className='bg-purple m-2 cursor-pointer hover:brightness-125 rounded-xl lg:px-10 lg:py-3 p-3 text-white font-semibold lg:text-2xl text-lg text-center'>
              Buy
            </button>
            <button
              onClick={() => setLink(<RentCard />)}
              className='bg-purple m-2 cursor-pointer hover:brightness-125 rounded-xl lg:px-10 lg:py-3 p-3 text-white font-semibold lg:text-2xl text-lg text-center'>
              Rent
            </button>
          </div>
        </div>
        <div className='lg:w-5/6 h-full flex flex-col items-center '>
          {' '}
          <h1 className=' text-white mx-auto font-semibold text-2xl py-2'>
            <u>OTT Plans</u>
          </h1>
          <div className=' flex flex-col justify-around mx-auto'>{link}</div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
