import React, {useEffect, useState} from 'react';
import axios from 'axios';

export default function PostHome() {
  const [todaysPost, setTodaysPost] = useState({});

  useEffect(() => {
    axios.get('http://localhost:8000/posts')
    .then(res => {
      setTodaysPost(res.data);
    })
    .catch(err => {
      console.error(err.message);
    })
  }, [])

  return (
    <div>
      hello
    </div>
  )
}
