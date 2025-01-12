'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';


const Main = () => {
  const router = useRouter();

  const LogOut = () => {
    document.cookie = `loggedIn=; expires=Wen, 01 Jan 2025 00:00:00 GMT; path=/;`;
    router.push('/');
  }

  return (
    <div>
      <h1>Main Menu</h1>
      <h2 onClick = {LogOut}>Wyloguj</h2>
    </div>
  );
};

export default Main;
