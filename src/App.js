import React, {useState, useEffect} from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import './styles/App.css';
import PostHome from './components/PostHome.js';
import Login from './components/Login.js';
import SignUp from './components/SignUp.js';
import Nav from './components/Nav.js';
import YourProfile from './components/YourProfile';
import UploadImage from './components/UploadImage';
import axios from 'axios';

function App() {
  const [state, setState] = useState({
    user: {},
    topic: {},
    dateToday: ''
  })

  useEffect(() => {
    const today = new Date(Date.now()).toString().slice(0, 15);
    setState(prev => ({...prev, dateToday: today}));
    axios.post('https://daylee-backend.onrender.com/topics/today', {today})
      .then(res => {
        setState(prev => ({...prev, topic: res.data}))
      })
      .catch(err => {
        console.error(err.message);
      })
    
    const data = window.localStorage.getItem('MY_APP_STATE');
    if ( data !== null ) setState(prev => ({...prev, user: JSON.parse(data)}));
  }, []);

  useEffect(() => {
    if(state.user.name) {
      window.localStorage.setItem('MY_APP_STATE', JSON.stringify(state.user));
    }
  }, [state.user])

  return (
    <Router>
      <Nav 
        state={state}
        setState={setState}
      />
      <Routes>
        <Route path='/' element={<PostHome
          state={state}
          setState={setState}
        />}/>
        <Route path='/login' element={<Login 
          state={state}
          setState={setState}
        />}/>
        <Route path='/signup' element={<SignUp 
          state={state}
          setState={setState}
        />}/>
        <Route path='/profile' element={<YourProfile 
          state={state}
          setState={setState}
        />}/>
        <Route path='/upload' element={<UploadImage />}/>
      </Routes>
    </Router>
  );
}

export default App;
