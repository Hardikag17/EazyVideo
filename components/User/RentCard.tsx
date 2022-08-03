import { useEffect, useState, useContext, useCallback } from 'react';
import { EazyVideoContext } from '../../utils/eazyVideoContext';
import Loader from '../Loader';
import Image from 'next/image';

export default function RentCard() {
  const { state } = useContext(EazyVideoContext);

  const [forLendServices, setForLendServices] = useState<LendMetadata[]>([]);

  const loadForLendServices = useCallback(async () => {
    try {
      var forLendArray = await state.SubsNFTContract.methods
        .forLendServices()
        .call({
          from: state.account,
        });

      console.log('forLendArray', forLendArray);

      // var servicesArray = await state.SubsNFTContract.methods
      //   .fetchAllUserLendNFTPlans()
      //   .call({
      //     from: state.account,
      //   });

      // for (var i = 0; i < servicesArray.length; i++) {
      //   var NFTPlan = await state.SubsNFTContract.methods
      //     .idToNftItem(servicesArray[i])
      //     .call({
      //       from: state.account,
      //     });
      //   var date = moment.unix(NFTPlan.endTime);
      //   var item: NFTMetadata;
      //   const metadata = await axios.get(NFTPlan.ImageUri);
      //   console.log('metadata:', metadata);
      //   if (metadata.data.image == undefined) {
      //     item = {
      //       serviceid: NFTPlan.serviceid,
      //       serviceName: NFTPlan.serviceName,
      //       ImageUri:
      //         'https://ipfs.infura.io/ipfs/QmUr2JP3nAF6E4Q12mgC5M1geFt7F4y6QHUqZFE9wgMZt7',
      //       description: NFTPlan.description,
      //       duration: NFTPlan.duration,
      //       endTime: date.toString(),
      //       price: NFTPlan.price,
      //       owner: NFTPlan.owner,
      //       serviceProvider: NFTPlan.serviceProvider,
      //     };
      //   } else {
      //     item = {
      //       serviceid: NFTPlan.serviceid,
      //       serviceName: NFTPlan.serviceName,
      //       ImageUri: metadata.data.image,
      //       description: NFTPlan.description,
      //       duration: NFTPlan.duration,
      //       endTime: date.toString(),
      //       price: NFTPlan.price,
      //       owner: NFTPlan.owner,
      //       serviceProvider: NFTPlan.serviceProvider,
      //     };
      //   }

      //   setUserAvailableServices((userAvailableServices) => [
      //     ...userAvailableServices,
      //     NFTPlan,
      //   ]);
      // }
    } catch (error) {
      console.log('error:', error);
    }
  }, [state, setForLendServices]);

  useEffect(() => {
    // if (state.walletConnected && forLendServices.length === 0) {
    loadForLendServices();
    // }
  });

  return (
    <div>
      {forLendServices.length > 0 ? (
        <div>
          {forLendServices.map((item, index) => {
            return (
              <div
                key={index}
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
                  Subsciption Logo
                </div>
                <div className='px-2 w-full text-left text-lg'>
                  <h5>ServiceProvider address</h5>
                  <h5>Name</h5>
                  <h5>Description</h5>
                  <h5>Duration</h5>
                  <h5>x BNB (Wei) for x days</h5>
                </div>
                <div className='flex flex-col'>
                  <div className='px-1 cursor-pointer py-1 mt-5 w-2/4 h-10 mx-auto flex flex-row bg-purple hover:brightness-105 hover:scale-105 rounded-full items-center justify-center'>
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
