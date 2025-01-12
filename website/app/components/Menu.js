'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Login from './Login';
import Main from './Main';


const Menu = (props) => {
  const [isLogged, setLogged] = useState(false)
  const result = props.logCookie ? <Main /> : <Login />
 

  console.log()

  return (result);
};

export default Menu;
