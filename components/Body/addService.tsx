import { useState } from 'react';

import { create as ipfsHttpClient } from 'ipfs-http-client';
const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0');

export default function AddService() {
  const [fileUrl, setFileUrl] = useState(null);

  const [formInput, updateFormInput] = useState({
    perDayPrice: '',
    name: '',
    description: '',
  });

  async function onChange(e) {
    console.log('running');
    const file = e.target.files[0];
    try {
      const added = await client.add(file, {
        progress: (prog) => console.log(`received: ${prog}`),
      });
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      console.log(url);
      setFileUrl(url);
    } catch (e) {
      console.log(e);
    }
  }

  return (
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
            MATIC
          </h1>
          For
          <input
            className='rounded-l h-full bg-white text-black w-full px-4 text-gray leading-tight focus:outline-none'
            type='number'
            onChange={(e) =>
              updateFormInput({ ...formInput, perDayPrice: e.target.value })
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
            <img className='rounded mt-4' width='350' src={fileUrl} />
          )}
        </div>
      </div>
      <div className=' py-10'>
        <h1>Are you here first Time? Register now</h1>
        <button
          onClick={() => {}}
          className='bg-purple m-2 hover:scale-105 cursor-pointer hover:brightness-125 rounded-xl lg:px-10 lg:py-3 p-3 text-white font-semibold lg:text-2xl text-xl text-center'>
          Add
        </button>
      </div>
    </div>
  );
}
