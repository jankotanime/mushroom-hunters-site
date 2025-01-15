'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Chat from './Chat';
import PanelHeader from './PanelHeader';
import { Vollkorn_SC } from 'next/font/google';


const Main = (props) => {
  return (
    <div>
      <Chat user = {props.user}/>
      <PanelHeader />
      <div className='user-panel'>
        <h1>Main Menu</h1>
      </div>
    </div>
  );
};

export default Main;
