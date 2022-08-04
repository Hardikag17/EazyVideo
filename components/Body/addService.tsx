import { useState, useContext } from 'react';
import { create } from 'ipfs-http-client';
import { EazyVideoContext } from '../../utils/eazyVideoContext';
import Image from 'next/image';

export default function AddService() {
  const [fileUrl, setFileUrl] = useState();
  const { state } = useContext(EazyVideoContext);

  const client = create({ url: 'https://ipfs.infura.io:5001/api/v0' });

  const [formInput, updateFormInput] = useState({
    perDayPrice: '',
    name: '',
    description: '',
    duration: '',
  });

  async function onChange(e: any) {
    console.log('running');
    const file = e.target.files[0];
    try {
      const added = await client.add(file, {
        progress: (prog) => console.log(`received: ${prog}`),
      });
      const url: any = `https://ipfs.infura.io/ipfs/${added.path}`;
      console.log(url);
      setFileUrl(url);
    } catch (e) {
      console.log(e);
    }
  }

  const createService = async () => {
    console.log('button clicked');
    console.log(state.account);
    const { perDayPrice, name, description, duration } = formInput;
    if (!name || !description || !perDayPrice || !fileUrl) return;
    const data = JSON.stringify({
      name,
      description,
      perDayPrice,
      duration,
      image: fileUrl,
    });

    try {
      const added = await client.add(data);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      // after file is uploaded to IPFS, pass the URL to save it on Polygon
      addService(url);
    } catch (error) {
      console.log('Error uploading file: ', error);
    }
  };

  async function addService(url: string) {
    try {
      await state.SubsNFTContract.methods
        .AddServiceToPlatform(
          formInput.name,
          url,
          formInput.description,
          formInput.duration,
          formInput.perDayPrice
        )
        .send({
          from: state.account,
        });
      alert(
        'Congrats!! we have successfully added your service to our platform'
      );
    } catch (error) {
      console.log('error:', error);
    }
  }

  return (
    <div>
      <div>
        <div className=' lg:text-web_title text-mobile_title'>* text</div>
        <div className='bg-white flex items-center rounded-lg border-2 border-solid border-grey shadow-xl'>
          <label className=' text-black  border-2 border-solid border-grey focus:outline-none w-24 h-12 flex items-center justify-center'>
            {' '}
            Name
          </label>
          <input
            className='rounded-l bg-white text-black w-full px-4 text-gray leading-tight focus:outline-none'
            type='text'
            onChange={(e) =>
              updateFormInput({ ...formInput, name: e.target.value })
            }
            placeholder='Eg: alex'
          />
          <button className=' text-black rounded-lg border-2 border-solid border-grey focus:outline-none w-24 h-12 flex items-center justify-center'>
            check
          </button>
        </div>
        <br />
        <div className='bg-white flex flex-col items-center rounded-lg border-2 border-solid border-grey shadow-xl'>
          <label className=' text-black  border-2 border-solid border-grey focus:outline-none w-full h-12 flex items-center justify-center'>
            {' '}
            Description
          </label>
          <textarea
            rows={5}
            onChange={(e) =>
              updateFormInput({ ...formInput, description: e.target.value })
            }
            className='rounded-l bg-white text-black w-full px-4 text-gray leading-tight focus:outline-none'
            placeholder='Eg: alex'
          />
        </div>
        <br />
        <div className=' flex flex-row '>
          <div className=' bg-white w-full h-12 mx-2 items-center rounded-lg border-2 border-solid border-grey shadow-xl flex flex-nowrap flex-row justify-around'>
            <label className=' text-black h-full  border-2 border-solid border-grey focus:outline-none w-48 '>
              {' '}
              Price
            </label>
            <input
              className='rounded-l h-full bg-white text-black w-full px-4 text-gray leading-tight focus:outline-none'
              type='number'
              onChange={(e) =>
                updateFormInput({ ...formInput, perDayPrice: e.target.value })
              }
              placeholder='0.5 MATIC'
            />
            <h1 className=' text-black rounded-lg border-2 border-solid border-grey focus:outline-none w-24 h-full '>
              BNB
            </h1>
            For
            <input
              className='rounded-l h-full bg-white text-black w-full px-4 text-gray leading-tight focus:outline-none'
              type='number'
              onChange={(e) =>
                updateFormInput({ ...formInput, duration: e.target.value })
              }
              placeholder='30 days'
            />
            Days
          </div>
          <div>
            <input
              type='file'
              name='Asset'
              className='my-4'
              onChange={onChange}
            />
            {fileUrl && (
              <Image
                alt='Ipfs upload image'
                className='rounded mt-4'
                width='350'
                height='200'
                src={fileUrl}
              />
            )}
          </div>
        </div>
        <div className=' py-10'>
          <button
            onClick={createService}
            className='bg-purple m-2 hover:scale-105 cursor-pointer hover:brightness-125 rounded-xl lg:px-10 lg:py-3 p-3 text-white font-semibold lg:text-2xl text-xl text-center'>
            Add Service
          </button>
        </div>
      </div>
    </div>
  );
}
