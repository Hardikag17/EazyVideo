import Image from 'next/image';
import { useEffect, useState, useContext } from 'react';
import { EazyVideoContext } from '../../utils/eazyVideoContext';
import Loader from '../Loader';
export default function BuyCard() {
  const [services, setServices] = useState([]);
  const { state } = useContext(EazyVideoContext);

  useEffect(() => {
    loadServices();
  });

  const loadServices = async () => {
    try {
      var totalServices = await state.SubsNFTContract.methods
        .totalServices()
        .call({
          from: state.account,
        });

      for (let i = 0; i < totalServices; i++) {
        var service = await state.SubsNFTContract.methods.idToNftItem(i).call({
          from: state.account,
        });

        console.log(service);
        // setServices([...services, service]);
      }
    } catch (error) {
      console.log('error:', error);
    }
  };
  return (
    <div
      className={`container w-full text-center p-3 border-0 rounded-lg bg-whiteish flex flex-row `}>
      <div className='bg-blue w-cover border-0 rounded-lg p-2 '>
        {/* <Image
            className='pt-5'
            src={}
            blurDataURL='/assets/TurtlePlaceholder.png'
            alt='placeholder'
            width={220}
            height={240}
          /> */}
        Subsciption Image
      </div>
      <div className='text-xl px-2 w-full'>
        <h5 className='text-left text-xl'>ServiceProvider address</h5>
        <h5 className='text-left text-xl'>Name</h5>
        <h5 className='text-left text-xl'>Description</h5>
        <h5 className='text-left text-xl'>Duration</h5>
      </div>

      <div className='px-1 py-1 w-2/4 h-10 mx-auto flex flex-row bg-purple hover:brightness-105 hover:scale-105 rounded-full items-center justify-center'>
        <button className='inline-block text-white'>Buy@ x MATIC</button>
      </div>
    </div>
  );
}
