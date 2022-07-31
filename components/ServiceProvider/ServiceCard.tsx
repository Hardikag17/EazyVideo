import Image from 'next/image';
import Router from 'next/router';
import { useState, useContext, useEffect } from 'react';
import { EazyVideoContext } from '../../utils/eazyVideoContext';
export default function ServiceCard() {
  const { state } = useContext(EazyVideoContext);
  const [service, setService] = useState();

  console.log(state.SubsNFTContract);

  const loadService = async () => {
    try {
      var serviceId = await state.SubsNFTContract.methods
        .serviceProviderToIds(state.account, 0)
        .call({
          from: state.account,
        });
      var servicePlan = await state.SubsNFTContract.methods
        .services(serviceId)
        .call({
          from: state.account,
        });
      console.log(servicePlan);
      setService(servicePlan);
    } catch (error) {
      console.log('error:', error);
    }
  };

  loadService();

  return (
    <div
      className={`container w-full text-center p-3 border-0 rounded-lg bg-whiteish flex flex-row `}>
      <div className='bg-blue w-cover border-0 rounded-lg p-2 '>
        {/* <Image
          className='pt-5'
          src={service.image}
          alt='Service Provider Image'
          width={220}
          height={240}
        /> */}
      </div>
      <div className='text-xl px-2 w-full'>
        {/* <h5 className='text-left text-xl'>{service.name}</h5>
        <h5 className='text-left text-xl'>{service.description}</h5>
        <h5 className='text-left text-xl'>{service.duration}</h5>
        <h5 className='text-left text-xl'>{service.perDayPrice}</h5> */}
      </div>
    </div>
  );
}
