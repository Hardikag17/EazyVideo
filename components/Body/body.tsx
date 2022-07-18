export default function Body() {
  return (
    <div className=' flex flex-col lg:mx-64 mx-auto lg:my-5 my-24 lg:px-4 lg:w-3/4 w-10/12'>
      <div className=' lg:text-web_title text-mobile_title'>
        Binge watch non-stop premium shows, awesome content from your favorite
        Movies, TV shows, web-series and many more
      </div>
      <div className='text-whiteish py-5 lg:px-2 text-small lg:w-3/4 w-full'>
        ~ Just now watching OTT has become affordable for everyone. Pay only
        when you are using the service
      </div>
      <div>
        <p>
          Usually whenever we take subscription from any OTT platform we often
          use it only 5-10% of time we subscribe for, but we ends up paying for
          the whole lot amount of time, this is where our platform EazyVideo
          comes in. Using EazyVideo users can rent out their OTT subscriptions
          while they are not using it and monetize on it. User can take
          subscriptions for whatever time they like by making customised plans.
          All of this would be done by using decaying NFTs
        </p>
        <p>
          <h1>
            1. Buy: Buy the OTT service directly from a service provider.{' '}
          </h1>
          <br />
          <h1>
            2. Rent: lend your susbscriptions to other users willing to
            rent/watch by sharing the time bounded decaying nft. This way user
            can make extensive use of the membership and also monetize on it if
            user is not using it personally by renting it on the platform.{' '}
          </h1>
          <br />
          <h1>
            3. Adding the OTT service: Add your OTT services for users to choose
            from, we assure you this platform is not to decrese your userbase on
            the contrary it is to increase it. This platform brings more users
            to your platform. Having any doubt feel free to reach us
          </h1>
        </p>
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
        <h1>Are you here first Time? Register now</h1>
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
