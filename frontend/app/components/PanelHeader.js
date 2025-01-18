'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import "./../globals.css";


const PanelHeader = (props) => {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  const [checkNotifications, setCheckNotifications] = useState(false);

  const searchBarChange = (e) => {
    setSearchText(e.target['value'])
  };

  const searchBarEnter = () => {
    router.push(`?search=${searchText}`)
    setSearchText('')
  }

  const logOut = async () => {
    try {
      const res = await fetch(`https://localhost:8000/api/logout`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        router.push('/');
      } else {
        console.log(res)
      }
    } catch (error) {
      console.log(error)
    }
  };

  const goToMain = () => {
    router.push(`/`)
  }

  const goToMyProfile = () => {
    router.push(`?profile=${props.user}`)
  }

  const goToFriendRequests = () => {
    router.push(`?friend-requests=true`)
  }

  const result = (<div className="user-panel-header">
    <div onClick={goToMain}>Main site</div>
    <div onClick={goToMyProfile}>Profil</div>
    <div onClick={goToFriendRequests}>Friend requests</div>
    <input
      type="text"
      id="search"
      name="search"
      value={searchText}
      onKeyDown={(e) => {e.key === "Enter" ? searchBarEnter() : null}} //&& searchText !== ''
      onChange={searchBarChange}
      placeholder="Wyszukaj..."
    />
    <div>Powiadomienia</div>
    <h2 onClick = {logOut}>Wyloguj</h2>
    To jest header
  </div>)
  return (result);
};

export default PanelHeader;
