import Image from 'next/image';
import Router from 'next/router';
import { useState, useContext, useEffect } from 'react';
import { EazyVideoContext } from '../../utils/eazyVideoContext';
import Loader from '../Loader';
import axios from 'axios';
export default function ServiceCard() {
  const state: EazyVideoContextInterface = useContext(EazyVideoContext);
  const [service, setService] = useState<ServiceMetadata>();

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

      const meta = await axios.get(servicePlan[2]);
      // let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
      let item = {
        name: servicePlan[1],
        image: meta.data.image,
        description: servicePlan[3],
        duration: servicePlan[4],
        perDayPrice: servicePlan[5],
        serviceProvider: servicePlan[6],
      };

      setService(item);
    } catch (error) {
      console.log('error:', error);
    }
  };

  loadService();

  return (
    <div>
      {service?.name.length > 0 ? (
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
            <h5 className='text-left text-xl'>{service.name}</h5>
            <h5 className='text-left text-xl'>{service.description}</h5>
            <h5 className='text-left text-xl'>{service.duration}</h5>
            <h5 className='text-left text-xl'>{service.perDayPrice}</h5>
          </div>
        </div>
      ) : (
        <Loader />
      )}
    </div>
  );
}
