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
import Friends from './Friends';
import FriendsToChat from './FriendsToChat';
import Dashboard from './Dashboard';
import mqtt from 'mqtt';

const Main = (props) => {
  const params = useSearchParams();
  const socket = io('https://localhost:3001',{
    transports: ['websocket', 'polling'], 
    withCredentials: true});

  const mqqtSocket = io('https://localhost:8001',{
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
        {params.get('profile') ? <Profile profile={params.get('profile')} user = {props.user} /> :
        params.get('search') ? <Search pattern = {params.get('search')} /> : 
        params.get('friend-requests') ? <FriendRequests user = {props.user} /> :
        params.get('friends') ? <Friends user = {props.user} /> : null}
        <Dashboard user={props.user} socket = {mqqtSocket}/>
        <FriendsToChat user = {props.user} var = {privateChats} fun = {addPrivateChat}/>
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
