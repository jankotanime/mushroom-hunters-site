'use client';
import { useRouter } from "next/navigation";
import "./../globals.css";
import { useEffect, useState } from "react";

const Friends = (props) => {
  const router = useRouter()
  const [friends, setFriends] = useState([])
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
          console.log('ok')
        } else {
          console.log('nie ok')
        }
      } catch (error) {
        console.log(error)
      }
    }

    fetchData()
  }, [props.user])
  console.log(friends)
  const result = (<div className="friends-container">{friends.map((user, id) => {
    console.log(user)
    return (<div className='friend' onClick={() => router.push(`/?profile=${user.username}`)} key={id}>{user.username}</div>)
  })}</div>)
  return (result);
};

export default Friends;