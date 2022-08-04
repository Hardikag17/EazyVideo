import { useEffect, useState, useContext, useCallback } from 'react';
import { EazyVideoContext } from '../../utils/eazyVideoContext';
import Loader from '../Loader';
import Image from 'next/image';
import axios from 'axios';

export default function RentCard() {
  const { state } = useContext(EazyVideoContext);

  const [forLendServices, setForLendServices] = useState<LendMetadata[]>([]);

  const loadForLendServices = useCallback(async () => {
    try {
      var userLendArray = await state.SubsNFTContract.methods
        .fetchAllUserLendNFTPlans()
        .call({
          from: state.account,
        });

      console.log('forLendArray', userLendArray);

      for (var index = 0; index < userLendArray.length; index++) {
        var servicesArray = await state.SubsNFTContract.methods
          .allLendServicesByIndex(userLendArray[0])
          .call({
            from: state.account,
          });

        var nftArray = await state.SubsNFTContract.methods
          .services(servicesArray.tokenId)
          .call({
            from: state.account,
          });
      }

      var item: LendMetadata = {
        tokenId: servicesArray.tokenId,
        price: servicesArray.price,
        duration: servicesArray.duration,
        renter: servicesArray.renter,
        NFT: nftArray,
      };

      const metadata = await axios.get(item.NFT.ImageUri);

      if (metadata.data.image == undefined) {
        item = {
          tokenId: servicesArray.tokenId,
          price: servicesArray.price,
          duration: servicesArray.duration,
          renter: servicesArray.renter,
          NFT: {
            serviceid: nftArray.serviceid,
            serviceName: nftArray.serviceName,
            ImageUri:
              'https://ipfs.infura.io/ipfs/QmUr2JP3nAF6E4Q12mgC5M1geFt7F4y6QHUqZFE9wgMZt7',
            description: nftArray.description,
            duration: nftArray.duration,
            endTime: nftArray.endTime,
            price: nftArray.price,
            owner: nftArray.owner,
            serviceProvider: nftArray.serviceProvider,
          },
        };
      } else {
        item = {
          tokenId: servicesArray.tokenId,
          price: servicesArray.price,
          duration: servicesArray.duration,
          renter: servicesArray.renter,
          NFT: {
            serviceid: nftArray.serviceid,
            serviceName: nftArray.serviceName,
            ImageUri: metadata.data.image,
            description: nftArray.description,
            duration: nftArray.duration,
            endTime: nftArray.endTime,
            price: nftArray.price,
            owner: nftArray.owner,
            serviceProvider: nftArray.serviceProvider,
          },
        };
      }
      setForLendServices((forLendServices) => [...forLendServices, item]);
    } catch (error) {
      console.log('error:', error);
    }
  }, [state, setForLendServices]);

  useEffect(() => {
    if (state.walletConnected && forLendServices.length === 0) {
      loadForLendServices();
    }
    console.log('forLendServices:', forLendServices);
  });

  return (
    <div>
      {forLendServices.length > 0 ? (
        <div className=' my-4 flex flex-row'>
          {forLendServices.map((item, index) => {
            return (
              <div
                key={index}
                className={`container w-full text-center p-3 border-0 rounded-lg bg-whiteish flex flex-col m-4 `}>
                <div className='bg-blue w-cover border-0 rounded-lg p-2 '>
                  <Image
                    className='pt-5'
                    src={item.NFT.ImageUri}
                    blurDataURL='/assets/TurtlePlaceholder.png'
                    alt='placeholder'
                    width={220}
                    height={240}
                  />
                </div>
                <div className='px-2 w-full text-left text-lg'>
                  <h5>ServiceProvider: {item.NFT.serviceProvider}</h5>
                  <h5>Owner: {item.NFT.owner}</h5>
                  <h5>Description: {item.NFT.description}</h5>
                  <h5>Name: {item.NFT.serviceName}</h5>
                  <h5>
                    {item.price} BNB (Wei) for {item.duration} days
                  </h5>
                </div>
                <div className='flex flex-col'>
                  <div className='px-1 cursor-pointer py-1 mt-5 w-full h-10 mx-auto flex flex-row bg-purple hover:brightness-105 hover:scale-105 rounded-full items-center justify-center'>
                    <button className='inline-block text-white'>Rent</button>
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
