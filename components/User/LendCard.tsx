import { useEffect, useState, useContext, useCallback } from 'react';
import { EazyVideoContext } from '../../utils/eazyVideoContext';
import Loader from '../Loader';
import Image from 'next/image';
import axios from 'axios';
import moment from 'moment';
export default function LendCard() {
  const { state } = useContext(EazyVideoContext);
  const [userAvailableServices, setUserAvailableServices] = useState<
    NFTMetadata[]
  >([]);
  const [userForLendServices, setUserForLendServices] = useState<
    LendMetadata[]
  >([]);
  const [formInput, updateFormInput] = useState({
    tokenid: 0,
    price: 0,
    duration: 0,
  });

  const lendService = async (item: NFTMetadata) => {
    updateFormInput({ ...formInput, tokenid: item.serviceid });
    const { tokenid, price, duration } = formInput;
    if (!price || !duration || !tokenid) return;
    const data = JSON.stringify({
      tokenid,
      price,
      duration,
    });
    try {
      await state.SubsNFTContract.methods
        .LendUserNFTPlan(formInput.tokenid, formInput.duration, formInput.price)
        .send({
          from: state.account,
        });
      alert('Congrats!! we have successfully added your service for lending');
    } catch (error) {
      console.log('error:', error);
    }
  };

  const loadUserAvaialableServices = useCallback(async () => {
    try {
      var servicesArray = await state.SubsNFTContract.methods
        .fetchAllUserAvailableNFTPlans()
        .call({
          from: state.account,
        });

      for (var i = 0; i < servicesArray.length; i++) {
        var NFTPlan = await state.SubsNFTContract.methods
          .idToNftItem(servicesArray[i])
          .call({
            from: state.account,
          });
        var date = moment.unix(NFTPlan.endTime);
        var item: NFTMetadata;
        const metadata = await axios.get(NFTPlan.ImageUri);

        if (metadata.data.image == undefined) {
          item = {
            serviceid: NFTPlan.serviceid,
            serviceName: NFTPlan.serviceName,
            ImageUri:
              'https://ipfs.infura.io/ipfs/QmUr2JP3nAF6E4Q12mgC5M1geFt7F4y6QHUqZFE9wgMZt7',
            description: NFTPlan.description,
            duration: NFTPlan.duration,
            endTime: date.toString(),
            price: NFTPlan.price,
            owner: NFTPlan.owner,
            serviceProvider: NFTPlan.serviceProvider,
          };
        } else {
          item = {
            serviceid: NFTPlan.serviceid,
            serviceName: NFTPlan.serviceName,
            ImageUri: metadata.data.image,
            description: NFTPlan.description,
            duration: NFTPlan.duration,
            endTime: date.toString(),
            price: NFTPlan.price,
            owner: NFTPlan.owner,
            serviceProvider: NFTPlan.serviceProvider,
          };
        }

        setUserAvailableServices((userAvailableServices) => [
          ...userAvailableServices,
          NFTPlan,
        ]);
      }
    } catch (error) {
      console.log('error:', error);
    }
  }, [state, userAvailableServices]);

  const loadUserForLendServices = useCallback(async () => {
    try {
      var forLendArray = await state.SubsNFTContract.methods
        .totalLendServices()
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
  }, [state, userForLendServices]);

  useEffect(() => {
    if (state.walletConnected && userAvailableServices.length === 0) {
      loadUserAvaialableServices();
    }
    if (state.walletConnected && userForLendServices.length === 0) {
      loadUserForLendServices();
    }
  });

  return (
    <div>
      <div className=' text-white my-2 text-2xl py-2'>
        <hr />
        <div>Available Plans</div>
        <hr />
      </div>
      {userAvailableServices.length > 0 ? (
        <div>
          {userAvailableServices.map((item, index) => {
            return (
              <div
                key={index}
                className={`container w-full text-center p-3 border-0 rounded-lg bg-whiteish flex flex-row my-4`}>
                <div className='bg-blue w-cover h-cover border-0 rounded-lg '>
                  <div>
                    <Image
                      src={item.ImageUri}
                      blurDataURL='../../assets/eazy_logo.png'
                      placeholder='blur'
                      alt='service image'
                      width={220}
                      height={210}
                    />
                  </div>
                </div>
                <div className='px-2 w-full text-left text-lg'>
                  <h5>ServiceProvider address: {item.serviceProvider}</h5>
                  <h5>Name: {item.serviceName}</h5>
                  <h5>Description: {item.description}</h5>
                  <h5>End-date: {item.endTime}</h5>
                </div>
                <div className='flex flex-col'>
                  <div className='bg-white flex items-center rounded-lg border-2 border-solid border-grey shadow-xl'>
                    <input
                      className='rounded-l bg-white w-full px-4 text-gray leading-tight focus:outline-none'
                      type='number'
                      placeholder='0.5'
                      onChange={(e) =>
                        updateFormInput({ ...formInput, price: e.target.value })
                      }
                    />
                    <button className='text-black rounded-lg border-2 border-solid border-grey focus:outline-none w-24 h-12 flex items-center justify-center'>
                      BNB/day (Wei)
                    </button>
                    For
                    <input
                      className='rounded-l bg-white w-full px-4 text-gray leading-tight focus:outline-none'
                      type='number'
                      placeholder='20 days'
                      onChange={(e) =>
                        updateFormInput({
                          ...formInput,
                          duration: e.target.value,
                        })
                      }
                    />
                    Days
                  </div>
                  <div className='px-1 cursor-pointer py-1 mt-5 w-2/4 h-10 mx-auto flex flex-row bg-purple hover:brightness-105 hover:scale-105 rounded-full items-center justify-center'>
                    <button
                      className='inline-block text-white'
                      onClick={() => lendService(item)}>
                      Lend
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          <div className=' text-white my-2 text-2xl py-2'>
            <hr />
            <div>For Lent Plans</div>
            <hr />
          </div>
        </div>
      ) : (
        <Loader />
      )}
    </div>
  );
}
