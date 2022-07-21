export default function Body() {
  return (
    <div className=' flex flex-col lg:mx-64 mx-auto lg:my-5 my-24 lg:px-4 lg:w-3/4 w-10/12'>
      <div className=' text-5xl lg:w-3/4 pt-5'>
        Binge watch non-stop premium shows, awesome content from your favorite
        Movies, TV shows, web-series and many more
      </div>
      <div className='text-whiteish py-5 lg:px-2 text-2xl lg:w-3/4 w-full'>
        ~ Just now watching OTT has become affordable for everyone. Pay only
        when you are using the service
      </div>

      {/* <div className='lg:w-3/4 w-full'>
        <div className='bg-white flex items-center rounded-lg border-2 border-solid border-grey shadow-xl'>
          <input
            className='rounded-l bg-white w-full px-4 text-gray leading-tight focus:outline-none'
            id='search'
            type='text'
            placeholder='Eg: alex'
          />
          <button className='text-whiteish rounded-lg border-2 border-solid border-grey focus:outline-none w-24 h-12 flex items-center justify-center'>
            .eth
          </button>
        </div>
      </div> */}

      <div className=' py-10 z-10 w-full'>
        <h1>Are you here first time? Register now</h1>
        <div className='flex flex-row '>
          <button
            onClick={() => {}}
            className='bg-purple m-2 hover:scale-105 cursor-pointer hover:brightness-125 rounded-xl lg:px-10 lg:py-3 p-3 text-white font-semibold lg:text-2xl text-xl text-center'>
            User
          </button>
          <button
            onClick={() => {}}
            className='bg-purple m-2 hover:scale-105 cursor-pointer hover:brightness-125 rounded-xl lg:px-10 lg:py-3 p-3 text-white font-semibold lg:text-2xl text-xl text-center'>
            Service Provider
          </button>
        </div>
      </div>
    </div>
  );
}
