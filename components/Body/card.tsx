import Image from 'next/image';
export default function Card() {
  return (
    <div
      className={`container w-72 text-center p-3 border-0 rounded-lg bg-whiteish `}>
      <div className='text-xl px-2'>
        <h5 className='text-left text-xl'>metadata</h5>
      </div>
      <div className='bg-blue w-cover border-0 rounded-lg p-2 text-white'>
        {/* <Image
          className='pt-5'
          src={}
          blurDataURL='/assets/TurtlePlaceholder.png'
          alt='placeholder'
          width={220}
          height={240}
        /> */}
        Subsciption Image
        <div className='px-1 py-1 w-2/4 h-10 mx-auto flex flex-row bg-purple hover:brightness-105 hover:scale-105 rounded-full items-center justify-center'>
          <button className='inline-block'>Buy@ 0.5 MATIC/day</button>
        </div>
      </div>
      <div className='text-xl w-full flex flex-row flex-wrap justify-center py-1'>
        attributes
      </div>
    </div>
  );
}
