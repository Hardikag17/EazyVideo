import type { NextPage } from 'next';
import { useState, useEffect } from 'react';

import Navbar from '../components/Navbar/navbar';
import Body from '../components/Body/body';
import Footer from '../components/Footer/footer';

const Home: NextPage = () => {
  return (
    <div className='font-primary h-screen text-white'>
      <Navbar />
      <Body />
      <Footer />
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
    </div>
  );
};

export default Home;
