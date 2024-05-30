// src/app/page.js
"use client"
import { useState, useEffect } from 'react';
import Inputquery from './components/frontend/Inputquery/page';
import Searchpage from './components/backend/Searchpage/page';


const Home = () => {


  return (
    <div className="flex flex-col items-center p-4">
     {/* // <Inputquery/> */}
      <Searchpage/>
     
     
    </div>
  );
};

export default Home;