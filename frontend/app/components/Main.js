'use client';
import { useState, useEffect } from 'react';
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
  const [friends, setFriends] = useState([])
  const [friendsRequests, setFriendsRequests] = useState([])

  const addPrivateChat = (roommate) => {
    const newPrivateChat = privateChats
    if (privateChats.length >= 3) {
      newPrivateChat.shift()
    }
    setPrivateChats([...newPrivateChat, roommate])
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`https://localhost:8000/api/all-friends?user=${encodeURIComponent(props.user)}`, {
          method: 'GET',
          headers: {'Content-Type': 'application/json'},
          credentials: 'include',
        });
        if (res.ok) {
          const data = await res.json();
          setFriends(data)
        }
      } catch (error) {
        console.log(error)
      }
      try {
        const res = await fetch(`https://localhost:8000/api/friend-requests?user=${encodeURIComponent(props.user)}`, {
          method: 'GET',
          headers: {'Content-Type': 'application/json'},
          credentials: 'include',
        });
        if (res.ok) {
          const data = await res.json();
          setFriendsRequests(data)
        }
      } catch (error) {
        console.log(error)
      }
    }

    fetchData()
  }, [props.user])
  return (
    <div>
      <Chat user = {props.user} socket = {socket}/>
      <FriendsToChat friends = {friends} user = {props.user} var = {privateChats} fun = {addPrivateChat}/>
      <PanelHeader user = {props.user} />
      <div className='private-chats-container'>
      {privateChats.map((chatWith, id) => {
        return (<div key={id}>
            <PrivateChat user = {props.user} roommate = {chatWith} id = {id} socket = {socket} privateChats = {privateChats} setPrivateChats = {setPrivateChats} />
          </div>)
      })}
      </div>
      <div className='user-panel'>
        {params.get('profile') ? <Profile friends = {[...friends, ...friendsRequests]} profile={params.get('profile')} user = {props.user} /> :
        params.get('search') ? <Search pattern = {params.get('search')} /> : 
        params.get('friend-requests') ? <FriendRequests user = {props.user} /> :
        params.get('friends') ? <Friends user = {props.user} /> : 
        <Dashboard user={props.user} socket = {mqqtSocket}/>}
      </div>
    </div>
  );
};

export default Main;
