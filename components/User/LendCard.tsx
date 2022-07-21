import Image from 'next/image';
export default function LendCard() {
  return (
    <div
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
        <h5>End-date</h5>
      </div>
      <div className='flex flex-col'>
        <div className='bg-white flex items-center rounded-lg border-2 border-solid border-grey shadow-xl'>
          <input
            className='rounded-l bg-white w-full px-4 text-gray leading-tight focus:outline-none'
            id='search'
            type='number'
            placeholder='0.5'
          />
          <button className='text-black rounded-lg border-2 border-solid border-grey focus:outline-none w-24 h-12 flex items-center justify-center'>
            MATIC/day
          </button>
          For
          <input
            className='rounded-l bg-white w-full px-4 text-gray leading-tight focus:outline-none'
            id='search'
            type='number'
            placeholder='0.5'
          />
          Days
        </div>
        <div className='px-1 cursor-pointer py-1 mt-5 w-2/4 h-10 mx-auto flex flex-row bg-purple hover:brightness-105 hover:scale-105 rounded-full items-center justify-center'>
          <button className='inline-block text-white'>Lend</button>
        </div>
      </div>
    </div>
  );
}
