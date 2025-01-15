'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import "./../globals.css";


const PanelHeader = (props) => {
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

  const result = (<div className="user-panel-header">
    <h2 onClick = {logOut}>Wyloguj</h2>
    To jest header
  </div>)
  return (result);
};

export default PanelHeader;
