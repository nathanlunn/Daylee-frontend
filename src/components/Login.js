import axios from 'axios';
import React, {useState} from 'react';
import '../styles/Login.css';
import { useNavigate } from 'react-router-dom';

export default function Login({state, setState}) {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('none');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const errorAfterLoading = (errMsg) => {
    setTimeout(() => {
      setLoading(false);
      setErrorMessage(errMsg);
    }, 1000)
  }

  const login = () => {
    setLoading(true);
    if(email === '') {
      errorAfterLoading('Email Must Not Be Blank');
      setTimeout(() => {
        setErrorMessage('none');
      }, 3000);
      return;
    }
    if(password === '') {
      errorAfterLoading('Password Must Not Be Blank');
      setTimeout(() => {
        setErrorMessage('none');
      }, 3000);
      return;
    }
    axios.post('https://daylee-backend.onrender.com/users/login', {email, password})
      .then(res => {
        if(typeof(res.data) === 'string') {
          errorAfterLoading(res.data);
          setTimeout(() => {
            setErrorMessage('none');
          }, 3000)
          return;
        }
        setState(prev => ({...prev, user: res.data}));
        setTimeout(() => {
          setLoading(false);
          navigate('/');
        })
      })
      .catch(err => {
        console.error(err.message);
      })
  }

  return (
    <div className='login'>
      {loading && <div className='login__spinner'></div>}
      
      <h2
        className={errorMessage === 'none' ? 'login__error hide' : 'login__error'}
      >{errorMessage}</h2>

      <h2 className='login__title'>Login:</h2>

      <input 
        className='login__input login__input--email'
        value={email}
        type='text'
        onChange={(e) => {
          setEmail(e.target.value);
        }} 
        placeholder='email'
      ></input>

      <div className='login__passwordContainer'>
      {/*Strictly to even out center slyling  */}
      {showPassword ? (<i 
          class="fa-solid fa-eye-slash"
          style={{opacity: 0}}
        ></i>) : (<i
          class="fa-solid fa-eye"
          style={{opacity: 0}}
        ></i>)}

        <input 
          className='login__input login__input--password'
          value={password}
          type={showPassword ? 'text' : 'password'}
          onChange={(e) => {
            setPassword(e.target.value);
          }} 
          onKeyPress={e => {if(e.key === 'Enter') login()}}
          placeholder='password'
        ></input>

        {showPassword ? (<i 
          class="fa-solid fa-eye-slash"
          onClick={() => {setShowPassword(false)}}
        ></i>) : (<i
          class="fa-solid fa-eye"
          onClick={() => {setShowPassword(true)}}
        ></i>)}
      </div>

      <button
        className='login__submit'
        onClick={login}
      >Login</button>

    </div>
  )
}
