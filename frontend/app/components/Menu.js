'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Login from './Login';
import Main from './Main';


const Menu = (props) => {
  const result = props.logCookie ? <Main logCookie = {props.logCookie}/> : <Login />

  return (result);
};

export default Menu;
