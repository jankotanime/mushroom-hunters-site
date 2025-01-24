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
        window.location.reload()
      } else {
        const data = await res.json();
        console.log(data.error)
      }
    } catch (error) {
      console.log(error)
    }
  }
  const deleteFriend = async () => {
    try {
      const res = await fetch(`https://localhost:8000/api/delete-friend`, {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify({user: props.user, profile: props.profile}),
      });
      if (res.ok) {
        window.location.reload()
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
            setPosts(data.reverse())
          } else {
            console.log('nie ok')
          }
        } catch (error) {
          console.log(error)
        }
      }
  
      getPosts()
    }, [])
    const result = (<div className="profile">
      <div className="my-profile-header">
      <div className="my-profile-header-name">{props.profile}</div>
      <div className="my-profile-options">
      {props.friendsRequests.length > 0 ? 
      props.friendsRequests.some(friend => friend.username === props.profile) ? 
      <div>Wysłano zaproszenie do znajomych</div> : 
      props.friends.length > 0 ?
      props.friends.some(friend => friend.username === props.profile) ?
      <div onClick={deleteFriend}>Usuń ze znajomych</div> : 
      <div onClick={addFriend}>Dodaj do znajomych</div> :
      <div onClick={addFriend}>Dodaj do znajomych</div> : 
      props.friends.length > 0 ?
      props.friends.some(friend => friend.username === props.profile) ?
      <div onClick={deleteFriend}>Usuń ze znajomych</div> :
      <div onClick={addFriend}>Dodaj do znajomych</div> :
      <div onClick={addFriend}>Dodaj do znajomych</div>}
      </div>
      </div>
      <div className="posts-container">
      {posts.map((post, id) => {
        return (<div className='post' key={id}>
          <div className="post-options"> 
            <div className='post-user'>{post.username}</div>
            <div className='post-content'>{post.content}</div>
          </div>
            {post.img ? <Image className="post-image" src={`https://localhost:8001${post.img}`} alt="Opis obrazu"width={300} height={400}/> : null}
            </div>)
    })}</div>
    </div>)
  return (result);
};

export default OtherProfile;