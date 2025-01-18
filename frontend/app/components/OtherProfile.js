'use client';
import { useRouter } from "next/navigation";
import "./../globals.css";
import { useEffect, useState } from "react";

const OtherProfile = (props) => {
  const router = useRouter()
  const addFriend = async () => {
    try {
      const res = await fetch(`https://localhost:8000/api/add-friend`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify({user: props.user, profile: props.profile}),
      });
      if (res.ok) {
        console.log(res.json())
        router.push('/');
      } else {
        const data = await res.json();
        console.log(data.error)
      }
    } catch (error) {
      console.log(error)
    }
  }
  const result = (<div><div onClick={addFriend}>Dodaj do znajomych</div></div>)
  return (result);
};

export default OtherProfile;