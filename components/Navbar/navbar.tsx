import Link from 'next/link';
import { Disclosure, Dialog, Menu, Transition } from '@headlessui/react';
import {
  BellIcon,
  MenuIcon,
  XIcon,
  ExclamationIcon,
} from '@heroicons/react/outline';
import { Fragment, useRef, useState } from 'react';
import { connectToWallet } from '../../utils/web3Client';

export default function Navbar() {
  const [modal, modalOpen] = useState(false);
  const cancelButtonRef = useRef(null);

  const HowItWorks = (
    <Transition.Root show={modal} as={Fragment}>
      <Dialog
        as='div'
        className='relative z-10'
        initialFocus={cancelButtonRef}
        onClose={modalOpen}>
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'>
          <div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
        </Transition.Child>

        <div className='fixed z-10 inset-0 overflow-y-auto'>
          <div className='flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
              enterTo='opacity-100 translate-y-0 sm:scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 translate-y-0 sm:scale-100'
              leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'>
              <Dialog.Panel className='relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full'>
                <div className=' flex flex-col mx-auto lg:my-5 my-24 lg:px-4'>
                  <div className=' text-center mx-auto font-bold text-web_title'>
                    <u>
                      <b>How it works</b>
                    </u>
                  </div>
                  <div>
                    <p>
                      Usually whenever we take subscription from any OTT
                      platform we often use it only 5-10% of time we subscribe
                      for, but we ends up paying for the whole lot amount of
                      time, this is where our platform EazyVideo comes in. Using
                      EazyVideo users can rent out their OTT subscriptions while
                      they are not using it and monetize on it. User can take
                      subscriptions for whatever time they like by making
                      customised plans. All of this would be done by using
                      decaying NFTs
                    </p>
                    <br />
                    <p>
                      <h1>
                        1. <b>Buy</b>: Buy the OTT service directly from a
                        service provider.{' '}
                      </h1>
                      <br />
                      <h1>
                        2. <b>Rent</b>: lend your susbscriptions to other users
                        willing to rent/watch by sharing the time bounded
                        decaying nft. This way user can make extensive use of
                        the membership and also monetize on it if user is not
                        using it personally by renting it on the platform.{' '}
                      </h1>
                      <br />
                      <h1>
                        3. <b>Adding the OTT service</b>: Add your OTT services
                        for users to choose from, we assure you this platform is
                        not to decrese your userbase on the contrary it is to
                        increase it. This platform brings more users to your
                        platform. Having any doubt feel free to reach us
                      </h1>
                    </p>
                  </div>
                </div>
                <div className='bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse'>
                  <button
                    type='button'
                    className='mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm'
                    onClick={() => modalOpen(false)}
                    ref={cancelButtonRef}>
                    Cool
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );

  return (
    <Disclosure as='nav'>
      {({ open }) => (
        <>
          <div className='max-w-7xl mx-auto lg:py-5 py-2 px-5 sm:px-8 lg:px-10'>
            {modal ? HowItWorks : <div></div>}
            <div className='relative flex items-center justify-between h-16'>
              <div className='absolute inset-y-0 left-0 flex items-center sm:hidden'>
                {/* Mobile menu button*/}
                <Disclosure.Button className='inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white'>
                  <span className='sr-only'>Open main menu</span>
                  {open ? (
                    <XIcon className='block h-6 w-6' aria-hidden='true' />
                  ) : (
                    <MenuIcon className='block h-6 w-6' aria-hidden='true' />
                  )}
                </Disclosure.Button>
              </div>
              <div className='flex-1 flex items-center justify-center sm:items-stretch sm:justify-start'>
                <div className='flex-shrink-0 flex items-center cursor-pointer'>
                  <Link href='/'>
                    <h1
                      className='block lg:hidden h-8 w-auto font-bold text-2xl'
                      alt='dsi.'>
                      EazyVideo<span className=' text-yellow'>.</span>📺
                    </h1>
                  </Link>
                  <Link href='/'>
                    <h1
                      className='hidden lg:block h-8 w-auto font-bold text-2xl'
                      alt='dsi.'>
                      EazyVideo<span className=' text-yellow'>.</span>📺
                    </h1>
                  </Link>
                </div>
              </div>
              <div className='absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0'>
                <Disclosure.Button as='a'>
                  <div className=' flex flex-row'>
                    <div className='opacity-0 lg:opacity-100 mr-5'>
                      <button
                        onClick={() => {
                          modalOpen(true);
                        }}
                        className='bg-purple hover:scale-105 cursor-pointer hover:brightness-125 rounded-xl lg:px-10 lg:py-3 p-3 text-white font-semibold lg:text-2xl text-xl text-center'>
                        How it works
                      </button>
                    </div>
                    <div>
                      <button
                        onClick={() => connectToWallet()}
                        className='bg-purple hover:scale-105 cursor-pointer hover:brightness-125 rounded-xl lg:px-10 lg:py-3 p-3 text-white font-semibold lg:text-2xl text-xl text-center'>
                        Connect to wallet{' '}
                        <span className=' text-yellow text-right text-web_normal font-bold'>
                          .
                        </span>
                      </button>
                    </div>
                  </div>
                </Disclosure.Button>
              </div>
            </div>
          </div>
          <Transition
            as={Fragment}
            enter='transition ease-out duration-200'
            enterFrom='transform opacity-0 scale-95'
            enterTo='transform opacity-100 scale-100'
            leave='transition ease-in duration-75'
            leaveFrom='transform opacity-100 scale-100'
            leaveTo='transform opacity-0 scale-95'>
            <Disclosure.Panel className='sm:hidden'>
              <div className='px-2 pt-2 pb-3 space-y-1'>
                <Disclosure.Button
                  as='a'
                  onClick={() => {
                    modalOpen(true);
                  }}
                  className='bg-purple hover:scale-105 cursor-pointer hover:brightness-125 rounded-xl lg:px-10 lg:py-3 p-3 text-white font-semibold lg:text-2xl text-xl text-center'>
                  How it works
                </Disclosure.Button>
              </div>
            </Disclosure.Panel>
          </Transition>
        </>
      )}
    </Disclosure>
  );
}
