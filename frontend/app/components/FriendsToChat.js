'use client';
import { useRouter } from "next/navigation";
import "./../globals.css";
import { useEffect, useState } from "react";

const FriendsToChat = (props) => {
  const [friendsFilter, setFriendsFilter] = useState('')
  const result = (<div className="friends-to-chat">
    <input
      className="search-friend-chat"
      type="text"
      id="search"
      name="search"
      value={friendsFilter}
      onChange={(e) => {setFriendsFilter(e.target['value'])}}
      placeholder="Wyszukaj..."
      />
    {props.friends.map((user, id) => {
      if (user.username.includes(friendsFilter)) {
        return (<div className="chat-friend" key={id} onClick={() => props.var.includes(user.username) ? null : props.fun(user.username)}>{user.username}</div>)
      }
  })}</div>)
  return (result);
};

export default FriendsToChat;