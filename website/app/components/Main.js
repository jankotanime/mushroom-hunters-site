'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Chat from './Chat';
import PanelHeader from './PanelHeader';


const Main = () => {
  return (
    <div>
      <Chat />
      <PanelHeader />
      <div className='user-panel'>
        <h1>Main Menu</h1>
      </div>
    </div>
  );
};

export default Main;
