import Image from 'next/image';
import Router from 'next/router';
import { useState, useContext, useEffect } from 'react';
import { EazyVideoContext } from '../../utils/eazyVideoContext';
export default function ServiceCard() {
  const { state } = useContext(EazyVideoContext);
  const [service, setService] = useState([]);

  console.log(state.EazyVideoContract);

  useEffect(() => {
    loadService();
  });
  const loadService = async () => {
    try {
      var service = await state.EazyVideoContract.methods
        .getServiceByAddress()
        .call({
          from: state.account,
        });

      console.log('services:', service);
      setService(service);
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
          alt='placeholder'
          width={220}
          height={240}
        /> */}
        Subsciption Image
      </div>
      <div className='text-xl px-2 w-full'>
        <h5 className='text-left text-xl'>Name</h5>
        <h5 className='text-left text-xl'>Description</h5>
        <h5 className='text-left text-xl'>Duration</h5>
        <h5 className='text-left text-xl'>Price</h5>
      </div>
    </div>
  );
}
