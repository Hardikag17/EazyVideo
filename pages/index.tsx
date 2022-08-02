import type { NextPage } from 'next';
import { useState, useEffect } from 'react';

import Navbar from '../components/Navbar/navbar';
import Body from '../components/Body/body';
import Footer from '../components/Footer/footer';

const Home: NextPage = () => {
  return (
    <div className='font-primary h-[100vh] text-white'>
      <Navbar />
      <Body />
      <div className='header__squares'>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
