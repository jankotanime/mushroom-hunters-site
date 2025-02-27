'use client';
import "./../globals.css";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const MyProfile = (props) => {
  const router = useRouter()
  const [posts, setPosts] = useState([])
  const [editingProfile, setEditingProfile] = useState(false)
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [editType, setEditType] = useState('username')
  const [deletingProfile, setDeletingProfile] = useState(false)
  const [error, setError] = useState(null)
  const [sureToDelete, setSureToDelete] = useState(null)

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

  const logOut = async () => {
    try {
      const res = await fetch(`https://localhost:8000/api/logout`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        router.push('/');
      } else {
        console.log(res)
      }
    } catch (error) {
      console.log(error)
    }
  };

  const editProfile = () => {
    const loginChange = (e) => {
      setLogin(e.target['value'])
    };
    const editProfileEnter = async () => {
      try {
        const res = await fetch(`https://localhost:8000/api/update/${editType}`, {
          method: 'PATCH',
          headers: {'Content-Type': 'application/json'},
          credentials: 'include',
          body: JSON.stringify({user: props.user, change: login}),
        });
        if (res.ok) {
          logOut()
        } else {
          const data = await res.json();
          setError(data.error)
        }
      } catch (error) {
        console.log(error)
        setError(data.error)
      }
    }

    const result = (<div className="my-profile-options">
      <div className="edit-profile-type">
      <div onClick={() => {setEditType('username'); setLogin('')}}>login</div>
      <div onClick={() => {setEditType('email'); setLogin('')}}>email</div>
      </div>
      <input
        type="text"
        id="login"
        name="login"
        value={login}
        onChange={(e) => loginChange(e)}
        onKeyDown={(e) => {e.key === "Enter" ? editProfileEnter() : null}}
      />
      <div className='info-about-logout'>Uwaga! Użytkownik zostanie wylogowany!</div>
    </div>)
    return result
  }

  const deleteProfile = () => {
    const passwordChange = (e) => {
      setPassword(e.target['value'])
    };
    const deleteProfileEnter = async () => {
      try {
        const res = await fetch(`https://localhost:8000/api/delete-account`, {
          method: 'DELETE',
          headers: {'Content-Type': 'application/json'},
          credentials: 'include',
          body: JSON.stringify({user: props.user, password: password}),
        });
        if (res.ok) {
          logOut()
        } else {
          const data = await res.json();
          console.log(data.error)
          setError(data.error)
        }
      } catch (error) {
        console.log(error)
        setError(data.error)
      }
    }

    const result = (<div>
      <input
        type="password"
        id="password"
        name="password"
        value={password}
        onChange={(e) => passwordChange(e)}
        onKeyDown={(e) => {e.key === "Enter" ? deleteProfileEnter() : null}}
      />
      <div>Uwaga! Użytkownik zostanie wylogowany!</div>
    </div>)
    return result
  }

  const deletePost = async (post) => {
    try {
      const res = await fetch(`https://localhost:8001/mqtt/delete-post`, {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify({id: post}),
      });
      if (res.ok) {
        window.location.reload()
      } else {
        const data = await res.json();
        console.log(data.error)
        setError(data.error)
      }
    } catch (error) {
      console.log(error)
      setError(data.error)
    }
  }


  const result = (<div className="profile">
  <div className="my-profile-header">
    <div className="my-profile-header-name">{props.user}</div>
      <div className="my-profile-options">
        <div className="edit-profile-type">
          <div onClick={() => {setEditingProfile(!editingProfile); setDeletingProfile(false)}}>Edytuj profil</div>
          <div onClick={() => {setDeletingProfile(!deletingProfile); setEditingProfile(false)}}>Usuń konto</div>
        </div>
        {deletingProfile ? deleteProfile() : editingProfile ? editProfile() : null}
        {error ? <div className="error">{error}</div> : null}
      </div>
    </div>
    <div className="posts-container">
      {posts.map((post, id) => {
      return (<div className='post' key={id}>
        <div className="post-options">
          <div className='post-user'>{post.username}</div>
          <div className='post-content'>{post.content}</div>
          {sureToDelete===id ? 
          <div className="post-delete" onClick={() => deletePost(post.id_post)}>Jesteś pewien?</div> : 
          <div className="post-delete" onClick={() => setSureToDelete(id)}>Usuń post</div>}
        </div>
        {post.img ? <Image src={`https://localhost:8001${post.img}`} alt="Opis obrazu" className="post-image" width={300} height={400}/> : null}
      </div>)
  })}</div></div>)
  return (result);
};

export default MyProfile;