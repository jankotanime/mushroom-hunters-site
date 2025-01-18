'use client';
import { useRouter } from "next/navigation";
import "./../globals.css";
import { useEffect, useState } from "react";

const FriendRequests = (props) => {
  const router = useRouter()
  const [requests, setRequests] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`https://localhost:8000/api/friend-requests?user=${encodeURIComponent(props.user)}`, {
          method: 'GET',
          headers: {'Content-Type': 'application/json'},
          credentials: 'include',
        });
        if (res.ok) {
          const data = await res.json();
          setRequests(data)
        } else {
          console.log('nie ok')
        }
      } catch (error) {
        console.log(error)
      }
    }

    fetchData()
  }, [])

  const acceptFriendRequest = async (user) => {
    try {
      const res = await fetch(`https://localhost:8000/api/accept-friend/${props.user}`, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify({user: user}),
      });
      if (res.ok) {
        console.log(res.json())
        router.push('/?friend-requests=true');
      } else {
        const data = await res.json();
        console.log(data.error)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const result = (<div>{requests.map((user, id) => {
    return (<div key={id}>{user.username}<div onClick={() => acceptFriendRequest(user.username)}>Akceptuj</div></div>)
  })}</div>)
  return (result);
};

export default FriendRequests;