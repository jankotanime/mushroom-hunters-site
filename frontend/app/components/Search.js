'use client';
import "./../globals.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Search = (props) => {    
  const router = useRouter();
  const [allUsers, setAllUsers] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`https://localhost:8000/api/all-users?pattern=${encodeURIComponent(props.pattern)}`, {
          method: 'GET',
          headers: {'Content-Type': 'application/json'},
          credentials: 'include',
        });
        if (res.ok) {
          const data = await res.json();
          setAllUsers(data)
        } else {
          console.log('nie ok')
        }
      } catch (error) {
        console.log(error)
      }
    }

    fetchData()
  }, [props.pattern])

  const goToProfile = (username) => {
    router.push(`?profile=${username}`)
  }

  const result = (<div className="friends-container">
    {allUsers.map((user, id) => {
      return (<div key={id} className='friend' onClick={() => goToProfile(user.username)}>{user.username}</div>)
    })}
  </div>)
  return (result);
};

export default Search;
