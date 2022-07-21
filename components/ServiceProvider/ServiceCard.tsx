import Image from 'next/image';
export default function ServiceCard() {
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
        Subsciption Image
      </div>
      <div className='text-xl px-2 w-full'>
        <h5 className='text-left text-xl'>Name</h5>
        <h5 className='text-left text-xl'>Description</h5>
        <h5 className='text-left text-xl'>Duration</h5>
        <h5 className='text-left text-xl'>Price</h5>
      </div>
      <div className=' flex flex-col w-full'>
        <div className='px-1 py-1 mb-5 w-2/4 h-10 mx-auto flex flex-row bg-purple hover:brightness-105 hover:scale-105 rounded-full items-center justify-center'>
          <button className='inline-block text-white'>Delete</button>
        </div>
        <div className='px-1 py-1 w-2/4 h-10 mx-auto flex flex-row bg-purple hover:brightness-105 hover:scale-105 rounded-full items-center justify-center'>
          <button className='inline-block text-white'>Update</button>
        </div>
      </div>
    </div>
  );
}
