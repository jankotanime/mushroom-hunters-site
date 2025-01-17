'use client';
import "./../globals.css";
import { useEffect, useState } from "react";

const Search = (props) => {    

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
          console.log('ok')
        } else {
          console.log('nie ok')
        }
      } catch (error) {
        console.log(error)
      }
    }

    fetchData()
  }, [props.pattern])

  const result = (<div>
    {allUsers.map((user, id) => {
      return (<div key={id}>{user.username}</div>)
    })}
  </div>)
  return (result);
};

export default Search;
