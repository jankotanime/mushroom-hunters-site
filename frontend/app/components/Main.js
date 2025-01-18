'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Chat from './Chat';
import PanelHeader from './PanelHeader';
import { Vollkorn_SC } from 'next/font/google';
import PrivateChat from './PrivateChat';
import { io } from 'socket.io-client';
import Profile from './Profile';
import Search from './Search';
import FriendRequests from './FreindRequests';


const Main = (props) => {
  const params = useSearchParams();
  const socket = io('https://localhost:3001',{
    transports: ['websocket', 'polling'], 
    withCredentials: true});

  const [privateChats, setPrivateChats] = useState([])

  const addPrivateChat = (roommate) => {
    const newPrivateChat = privateChats
    if (privateChats.length >= 3) {
      newPrivateChat.shift()
    }
    setPrivateChats([...newPrivateChat, roommate])
  }

  return (
    <div>
      <Chat user = {props.user} socket = {socket}/>
      <PanelHeader user = {props.user} />
      <div className='user-panel'>
        <h1>Main Menu</h1>
        {params.get('profile') ? <Profile profile={params.get('profile')} user = {props.user} /> :
        params.get('search') ? <Search pattern = {params.get('search')} /> : 
        params.get('friend-requests') ? <FriendRequests user = {props.user} /> : null}
        <div onClick={() => privateChats.includes('aa') ? null : addPrivateChat('aa')}>aa</div>
        <div onClick={() => privateChats.includes('test') ? null : addPrivateChat('test')}>test</div>
        <div onClick={() => privateChats.includes('misio') ? null : addPrivateChat('misio')}>misio</div>
        <div className='private-chats-container'>
        {privateChats.map((chatWith, id) => {
          return (<div 
            className='private-chat-one' 
            key={id}>
              <PrivateChat user = {props.user} roommate = {chatWith} id = {id} socket = {socket}/>
            </div>)
        })}
        </div>
      </div>
    </div>
  );
};

export default Main;
