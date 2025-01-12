'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';


const Main = () => {
  const router = useRouter();

  const logOut = async () => {
    try {
      const res = await fetch(`https://localhost:8000/api/logout`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
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

  // const LogOut = () => {
  //   // document.cookie = `loggedIn=; expires=Wen, 01 Jan 2025 00:00:00 GMT; path=/;`;
  //   // router.push('/logout');
  // }

  return (
    <div>
      <h1>Main Menu</h1>
      <h2 onClick = {logOut}>Wyloguj</h2>
    </div>
  );
};

export default Main;
