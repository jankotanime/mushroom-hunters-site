'use client';
import "./../globals.css";
import { useEffect, useState } from "react";
import Image from "next/image";

const MyProfile = (props) => {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    const getPosts = async () => {
      try {
        const res = await fetch(`https://localhost:8001/mqtt/get-user-posts?user=${encodeURIComponent(props.user)}`, {
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

  const result = (<div>{posts.map((post, id) => {
    return (<div key={id}>
          {post.username}: {post.content}
          {post.img ? <Image src={`https://localhost:8001${post.img}`} alt="Opis obrazu"width={500} height={300}/> : null}
          </div>)
  })}</div>)
  return (result);
};

export default MyProfile;