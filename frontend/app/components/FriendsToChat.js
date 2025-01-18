'use client';
import { useRouter } from "next/navigation";
import "./../globals.css";
import { useEffect, useState } from "react";

const FriendsToChat = (props) => {
  const [friends, setFriends] = useState([])
  const [friendsFilter, setFriendsFilter] = useState('')
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
    }

    fetchData()
  }, [props.user])
  const result = (<div className="friends-to-chat">
    <input
      type="text"
      id="search"
      name="search"
      value={friendsFilter}
      onChange={(e) => {setFriendsFilter(e.target['value'])}}
      placeholder="Wyszukaj..."
      />
    {friends.map((user, id) => {
      if (user.username.includes(friendsFilter)) {
        return (<div key={id} onClick={() => props.var.includes(user.username) ? null : props.fun(user.username)}>{user.username}</div>)
      }
  })}</div>)
  return (result);
};

export default FriendsToChat;