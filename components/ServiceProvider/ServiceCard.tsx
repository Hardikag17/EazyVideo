import Image from 'next/image';
import Router from 'next/router';
import { useState, useContext, useEffect } from 'react';
import { EazyVideoContext } from '../../utils/eazyVideoContext';
import Loader from '../Loader';
import axios from 'axios';
export default function ServiceCard() {
  const state: EazyVideoContextInterface = useContext(EazyVideoContext);
  const [services, setServices] = useState<ServiceMetadata[]>([]);

  const loadServices = async () => {
    try {
      for (let i = 0; i < 5; i++) {
        var serviceId = await state.SubsNFTContract.methods
          .serviceProviderToIds(state.account, i)
          .call({
            from: state.account,
          });

        if (serviceId != undefined) {
          var service = await state.SubsNFTContract.methods
            .services(serviceId)
            .call({
              from: state.account,
            });

          setServices((services) => [...services, service]);
        } else break;

        //const meta = await axios.get(servicePlan[2]);
        // let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
      }
    } catch (error) {
      console.log('error:', error);
    }
  };

  useEffect(() => {
    if (state.walletConnected && services.length === 0) {
      loadServices();
    }
  });
  return (
    <div>
      <div>(Latest five active services)</div>
      {services.length > 0 ? (
        <div>
          {services.map((item, i) => {
            return (
              <div
                key={i}
                className={`container w-full text-center p-3 border-0 rounded-lg bg-whiteish flex flex-row `}>
                <div className='bg-blue w-cover border-0 rounded-lg p-2 '>
                  {/* <Image
                    className='pt-5'
                    src={item.ImageUri}
                    alt='Service Provider Image'
                    width={220}
                    height={240}
                  /> */}
                </div>
                <div className='text-xl px-2 w-full'>
                  <h5 className='text-left text-xl'>{item.name}</h5>
                  <h5 className='text-left text-xl'>{item.description}</h5>
                  <h5 className='text-left text-xl'>{item.planDuration}</h5>
                  <h5 className='text-left text-xl'>{item.price}</h5>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <Loader />
      )}
    </div>
  );
}
