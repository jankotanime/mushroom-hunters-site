'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Chat from './Chat';
import PanelHeader from './PanelHeader';
import { Vollkorn_SC } from 'next/font/google';
import PrivateChat from './PrivateChat';


const Main = (props) => {
  const [chatPrivate, setChatPrivate] = useState('')
  return (
    <div>
      <Chat user = {props.user}/>
      <PanelHeader />
      <div className='user-panel'>
        <h1>Main Menu</h1>
        <div onClick={() => setChatPrivate('aa')}>aa</div>
        <div onClick={() => setChatPrivate('test')}>test</div>
        <div onClick={() => setChatPrivate('misio')}>misio</div>
        <PrivateChat user = {props.user} roommate = {chatPrivate}/>
      </div>
    </div>
  );
};

export default Main;
