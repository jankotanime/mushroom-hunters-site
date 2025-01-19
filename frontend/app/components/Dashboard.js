'use client';
import "./../globals.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Dashboard = (props) => {    
  const router = useRouter();
  const [posts, setPosts] = useState([])
  const [newPostText, setNewPostText] = useState('');
  const [newPostImage, setNewPostImage] = useState(null);

  const newPostTextChange = (e) => {
    setNewPostText(e.target['value'])
  };

  const newPostTextEnter = async () => {
    try {
      const res = await fetch(`https://localhost:8001/mqtt/send-post`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify({user: props.user, content: newPostText})
      });
      setNewPostText('')
      router.push(`/?profile=${props.user}`)
      if (!res.ok) {
        console.log('nie ok')
      }
    } catch (error) {
      console.log(error)
    }
  }
  
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
          props.socket.emit("enter-dashboard", props.user, data);
          props.socket.on("message", (data) => {
            const {username, content} = data
            setPosts((prevPosts) => [{username: username, content: content}, ...prevPosts])
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
        const res = await fetch(`https://localhost:8001/mqtt/get-all-posts?user=${encodeURIComponent(props.user)}`, {
          method: 'GET',
          headers: {'Content-Type': 'application/json'},
          credentials: 'include',
        });
        if (res.ok) {
          const data = await res.json();
          setPosts(data)
          console.log(data)
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

  const addImage = (e) => {
    const file = e.target.files[0]
    if (file) {
      const formData = new FormData();
      setNewPostImage(formData.append('image', file))
    }
  };

  const result = (<div>
    <input type="file" accept="image/*" onChange={addImage} />
    <input
    type="text"
    id="post"
    name="post"
    value={newPostText}
    onKeyDown={(e) => {e.key === "Enter" ? newPostTextEnter() : null}}
    onChange={newPostTextChange}
    placeholder="O czym myślisz?"
  />
    <Image src="/posts/grzybtest.jpeg" alt="Opis obrazu"width={500} height={300}/>
    {posts.map((post, id) => {
    return (<div key={id}>{post.username}: {post.content}</div>)
  })}</div>)
  return (result);
};

export default Dashboard;
