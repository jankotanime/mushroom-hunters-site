'use client';
import { useRouter } from "next/navigation";
import "./../globals.css";
import { useEffect, useState } from "react";
import Image from "next/image";

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
  const [posts, setPosts] = useState([])
  
    useEffect(() => {
      const getPosts = async () => {
        try {
          const res = await fetch(`https://localhost:8001/mqtt/get-user-posts?user=${encodeURIComponent(props.profile)}`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
          });
          if (res.ok) {
            const data = await res.json();
            setPosts(data)
            console.log('ok')
          } else {
            console.log('nie ok')
          }
        } catch (error) {
          console.log(error)
        }
      }
  
      getPosts()
    }, [])
  
    const result = (<div><div onClick={addFriend}>Dodaj do znajomych</div>
      {posts.map((post, id) => {
      return (<div key={id}>
            {post.username}: {post.content}
            {post.img ? <Image src={`https://localhost:8001${post.img}`} alt="Opis obrazu"width={500} height={300}/> : null}
            </div>)
    })}</div>)
  return (result);
};

export default OtherProfile;