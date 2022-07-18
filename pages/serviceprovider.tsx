import Footer from '../components/Footer/footer';
import Navbar from '../components/Navbar/navbar';
import Card from '../components/Body/card';
import AddService from '../components/Body/addService';
import { useState } from 'react';

export default function ServiceProvider() {
  const [state, setState] = useState(0);
  const Component = [
    {
      title: 'Add',
      link: <AddService />,
    },
    {
      title: 'Current',
      link: <Card />,
    },
  ];

  return (
    <div>
      <Navbar />
      <div className=' flex lg:flex-row flex-col mx-auto lg:px-4 lg:w-5/6 w-full m-2 justify-start'>
        <div className='lg:w-1/6 flex flex-col w-full  items-center'>
          <div className=' w-full m-1 flex lg:flex-col flex-row justify-around'>
            <button
              onClick={() => {
                setState(0);
              }}
              className='bg-purple m-2 cursor-pointer hover:brightness-125 rounded-xl lg:px-10 lg:py-3 p-3 text-white font-semibold lg:text-2xl text-lg text-center'>
              Add
            </button>
            <button
              onClick={() => {
                setState(1);
              }}
              className='bg-purple m-2 cursor-pointer hover:brightness-125 rounded-xl lg:px-10 lg:py-3 p-3 text-white font-semibold lg:text-2xl text-lg text-center'>
              Current
            </button>
            <div className=' text-white m-2 lg:py-3 p-3'>
              <h1>Pending Collection</h1> x MATIC
            </div>
          </div>
        </div>
        <div className='w-full h-full flex flex-col items-center '>
          <div className='border-2 border-solid border-whiteish rounded-xl text-center w-3/4 '>
            <h1 className=' text-white mx-auto font-semibold text-2xl py-2'>
              {Component[state].title} Service
            </h1>
            <div className=' flex flex-row justify-around mx-auto'>
              {Component[state].link}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
