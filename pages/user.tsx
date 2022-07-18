import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import Navbar from '../components/Navbar/navbar';
import Footer from '../components/Footer/footer';
import Card from '../components/Body/card';

export default function User() {
  return (
    <div className=' h-screen'>
      <Navbar />
      <div className=' flex lg:flex-row flex-col mx-auto lg:px-4 lg:w-5/6 w-full m-2 justify-start'>
        <div className='lg:w-1/6 flex flex-col w-full  items-center'>
          <div className=' w-full m-1 flex lg:flex-col flex-row justify-around'>
            <button
              onClick={() => {}}
              className='bg-purple m-2 cursor-pointer hover:brightness-125 rounded-xl lg:px-10 lg:py-3 p-3 text-white font-semibold lg:text-2xl text-lg text-center'>
              Buy
            </button>
            <button
              onClick={() => {}}
              className='bg-purple m-2 cursor-pointer hover:brightness-125 rounded-xl lg:px-10 lg:py-3 p-3 text-white font-semibold lg:text-2xl text-lg text-center'>
              Lend
            </button>
            <button
              onClick={() => {}}
              className='bg-purple m-2 cursor-pointer hover:brightness-125 rounded-xl lg:px-10 lg:py-3 p-3 text-white font-semibold lg:text-2xl text-lg text-center'>
              Rent
            </button>
          </div>
        </div>
        <div className='w-full h-full flex flex-col items-center '>
          {' '}
          <h1 className=' text-white mx-auto font-semibold text-2xl py-2'>
            User data
          </h1>
          <div className=' flex flex-row justify-around mx-auto'>
            <Card />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
