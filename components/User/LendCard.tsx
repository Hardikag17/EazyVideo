import { useEffect, useState, useContext, useCallback } from 'react';
import { EazyVideoContext } from '../../utils/eazyVideoContext';
import Loader from '../Loader';
import Image from 'next/image';
import axios from 'axios';
export default function LendCard() {
  const { state } = useContext(EazyVideoContext);
  const [userServices, setUserServices] = useState<NFTMetadata[]>([]);
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
    console.log(data);
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

  const loadUserServices = useCallback(async () => {
    try {
      var servicesArray = await state.SubsNFTContract.methods
        .fetchAllUserAvailableNFTPlans()
        .call({
          from: state.account,
        });

      for (var i = 0; i < servicesArray.length; i++) {
        var NFTPlan: NFTMetadata = await state.SubsNFTContract.methods
          .idToNftItem(servicesArray[i])
          .call({
            from: state.account,
          });

        console.log('nftplan:', NFTPlan);

        var item: NFTMetadata;
        const metadata = await axios.get(NFTPlan.ImageUri);
        console.log('metadata:', metadata);
        if (metadata.data.image == undefined) {
          item = {
            serviceid: NFTPlan.serviceid,
            serviceName: NFTPlan.serviceName,
            ImageUri:
              'https://ipfs.infura.io/ipfs/QmUr2JP3nAF6E4Q12mgC5M1geFt7F4y6QHUqZFE9wgMZt7',
            description: NFTPlan.description,
            duration: NFTPlan.duration,
            endTime: NFTPlan.endTime,
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
            endTime: NFTPlan.endTime,
            price: NFTPlan.price,
            owner: NFTPlan.owner,
            serviceProvider: NFTPlan.serviceProvider,
          };
        }

        setUserServices((userServices) => [...userServices, NFTPlan]);
      }
    } catch (error) {
      console.log('error:', error);
    }
  }, [state, userServices]);

  useEffect(() => {
    if (state.walletConnected && userServices.length === 0) {
      loadUserServices();
    }
    console.log(userServices);
  });

  return (
    <div>
      {userServices.length > 0 ? (
        <div>
          {userServices.map((item, index) => {
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
        </div>
      ) : (
        <Loader />
      )}
    </div>
  );
}
