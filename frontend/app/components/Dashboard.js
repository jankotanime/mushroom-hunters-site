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
  const [gotNewPost, setGotNewPost] = useState(false)

  const newPostTextChange = (e) => {
    setNewPostText(e.target['value'])
  };

  const newPostTextEnter = async () => {
    try {
      const formData = new FormData();
      if (newPostImage) {
        formData.append('image', newPostImage)
      }
      formData.append('user', props.user);
      formData.append('content', newPostText);
      const res = await fetch(`https://localhost:8001/mqtt/send-post`, {
        method: 'POST',
        credentials: 'include',
        body: formData
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
            const {username, content, img} = data
            if (!gotNewPost) {
              setGotNewPost(true)
              setPosts((prevPosts) => [{username: username, content: content, img: img}, ...prevPosts])
              setTimeout(() => {
                setGotNewPost(false)
              }, 250)
            }
            console.log(posts)
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
          setPosts(data.reverse())
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
    setNewPostImage(e.target.files[0])
  };

  const result = (<div className="profile">
    <div className="new-post">
      <input
        className="new-post-content"
        type="text"
        id="post"
        name="post"
        value={newPostText}
        onKeyDown={(e) => {e.key === "Enter" ? newPostTextEnter() : null}}
        onChange={newPostTextChange}
        placeholder="Podziel się zdjęciem grzyba..."
      />
      <input type="file" accept="image/*" onChange={addImage} />
    </div>
    <div className="posts-container">
          {posts.map((post, id) => {
          return (<div className='post' key={id}>
            <div className="post-options">
              <div className='post-user'>{post.username}</div>
              <div className='post-content'>{post.content}</div>
            </div>
            {post.img ? <Image src={`https://localhost:8001${post.img}`} alt="Opis obrazu" className="post-image" width={300} height={400}/> : null}
          </div>)
      })}</div></div>)
  return (result);
};

export default Dashboard;
