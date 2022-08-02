import Image from 'next/image';
import { useEffect, useState, useContext, useCallback } from 'react';
import { EazyVideoContext } from '../../utils/eazyVideoContext';
import Loader from '../Loader';
export default function BuyCard() {
  const [services, setServices] = useState<ServiceMetadata[]>([]);
  const { state } = useContext(EazyVideoContext);

  const loadServices = useCallback(async () => {
    try {
      var totalServices = await state.SubsNFTContract.methods
        .totalServices()
        .call({
          from: state.account,
        });

      for (let i = 0; i <= totalServices; i++) {
        var service = await state.SubsNFTContract.methods.services(i).call({
          from: state.account,
        });

        setServices((services) => [...services, service]);

        console.log(service);
      }
    } catch (error) {
      console.log('error:', error);
    }
  }, [state, services]);

  useEffect(() => {
    if (state.walletConnected && services.length === 0) {
      loadServices();
    }
  });

  const buyService = async (index: number) => {};

  console.log('state walletConnected:', state.walletConnected);
  return (
    <div>
      {services.length > 0 ? (
        <div className=' w-full h-full flex flex-col'>
          {services.map((item, i) => {
            return (
              <div
                key={i}
                className={`container w-full h-48 text-center p-3 border-0 rounded-lg bg-whiteish flex flex-row mt-4`}>
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
                  <h5 className='text-left text-l'>
                    ServiceProvider address: {item.serviceProvider}
                  </h5>
                  <h5 className='text-left text-l'>Name:{item.name}</h5>
                  <h5 className='text-left text-l'>
                    Description: {item.description}
                  </h5>
                  <h5 className='text-left text-l'>
                    Duration: {item.planDuration}
                  </h5>
                  <div className='px-1 py-1 w-2/4 h-10 mx-auto flex flex-row bg-purple hover:brightness-105 hover:scale-105 rounded-full items-center justify-center'>
                    <button
                      onClick={() => buyService(i)}
                      className='inline-block text-white'>
                      Buy@ {item.price} MATIC
                    </button>
                  </div>
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
