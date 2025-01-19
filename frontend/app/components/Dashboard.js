'use client';
import "./../globals.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Dashboard = (props) => {    
  const router = useRouter();
  const [posts, setPosts] = useState([])
  const [friends, setFriends] = useState([])
  
  useEffect(() => {
    const mqttStart = async () => {
      try {
        const res = await fetch(`https://localhost:8000/api/all-friends?user=${encodeURIComponent(props.user)}`, {
          method: 'GET',
          headers: {'Content-Type': 'application/json'},
          credentials: 'include',
        });
        if (res.ok) {
          const data = await res.json();
          setFriends(data)
          props.socket.emit("enter-dashboard", props.user, data);
          props.socket.on("message", (data) => {
            const {user, content} = data
            setPosts((prevPosts) => [...prevPosts, {user: user, content: content}])
          });
        } else {
          console.log('nie ok')
        }
      } catch (error) {
        console.log(error)
      }
    }
    mqttStart()

    const getPosts = async () => {
      try {
        const res = await fetch(`https://localhost:8001/mqtt/get-all-posts`, {
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
    return (<div key={id}>{post.user}: {post.content}</div>)
  })}</div>)
  return (result);
};

export default Dashboard;
