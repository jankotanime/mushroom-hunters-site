'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import "./../globals.css";


const PanelHeader = (props) => {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');

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
    console.log(router)
    router.replace(`/`)
  }

  const goToMyProfile = () => {
    router.push(`?profile=${props.user}`)
  }

  const goToFriendRequests = () => {
    router.push(`?friend-requests=true`)
  }

  const goToFriends = () => {
    router.push(`?friends=true`)
  }

  const result = (<div className="user-panel-header">
    <div className='user-panel-point' onClick={goToMain}>Strona główna</div>
    <div className='user-panel-point' onClick={goToMyProfile}>Profil</div>
    <input
      className='header-search'
      type="text"
      id="search"
      name="search"
      value={searchText}
      onKeyDown={(e) => {e.key === "Enter" ? searchBarEnter() : null}} //&& searchText !== ''
      onChange={searchBarChange}
      placeholder="Wyszukaj..."
    />
    <div className='user-panel-point' onClick={goToFriends}>Znajomi</div>
    <div className='user-panel-point' onClick={goToFriendRequests}>Zaproszenia</div>
    <div className='user-panel-point' onClick = {logOut}>Wyloguj</div>
  </div>)
  return (result);
};

export default PanelHeader;
