import Image from 'next/image';
import { useEffect, useState, useContext, useCallback } from 'react';
import { EazyVideoContext } from '../../utils/eazyVideoContext';
import Loader from '../Loader';
import axios from 'axios';
import { getURL } from 'next/dist/shared/lib/utils';
export default function BuyCard() {
  const [services, setServices] = useState<ServiceMetadata[]>([]);
  const [url, ImageUrl] = useState<string>(
    'https://ipfs.infura.io/ipfs/QmUr2JP3nAF6E4Q12mgC5M1geFt7F4y6QHUqZFE9wgMZt7'
  );
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

        service.ImageUri = setUrl(service);

        setServices((services) => [...services, service]);
      }
    } catch (error) {
      console.log('error:', error);
    }
  }, [state]);

  useEffect(() => {
    if (state.walletConnected && services.length === 0) {
      loadServices();
    }
  });

  const buyService = async (item: ServiceMetadata) => {
    console.log(item.serviceid);
    try {
      await state.SubsNFTContract.methods
        .BuyServiceFromServiceProvider(item.serviceid)
        .send({
          from: state.account,
          value: item.price,
        });

      alert('Congarts, you have bought one subscription from eazyVideo');
    } catch (error) {
      console.log('error:', error);
    }
  };

  const setUrl = useCallback(async (item: ServiceMetadata) => {
    try {
      const metadata = await axios.get(item.ImageUri);
      console.log(metadata.data.image);
      return metadata.data.image;
    } catch (error) {
      return '';
    }
  }, []);

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
                <div className='bg-blue w-cover h-cover border-0 rounded-lg '>
                  {url ? (
                    <div>
                      <Image
                        src={url}
                        blurDataURL='../../assets/eazy_logo.png'
                        placeholder='blur'
                        alt='service image'
                        width={220}
                        height={210}
                      />
                    </div>
                  ) : (
                    <div>Subsciption Image</div>
                  )}
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
                      onClick={() => buyService(item)}
                      className='inline-block text-white'>
                      Buy@ {item.price} (Wei) BNB
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
