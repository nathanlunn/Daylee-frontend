import React from 'react';
import {Link, useNavigate} from 'react-router-dom';
import '../styles/Nav.css';
import name from '../assets/name.png';

export default function Nav({state, setState}) {
  const navigate = useNavigate();

  return (
    <div className='nav'>
      <img className='nav__name' src={name} onClick={() => {navigate('/')}}/>
      <div className='nav__linkBox'>
        <Link className='nav__link' to='/'>HOME</Link>
        {state.user.name ? (
          <>
            <Link className='nav__link' to='/profile'>PROFILE</Link>
            <div className='nav__link nav__link--logout' onClick={() => {
              setState(prev => ({...prev, user:{}}));
              window.localStorage.setItem('MY_APP_STATE', JSON.stringify({}));
              navigate('/');
            }}>LOGOUT</div>
          </>
        ) : (
          <>
            <Link className='nav__link' to='/login'>LOGIN</Link>
            <Link className='nav__link' to='/signup'>SIGN UP</Link>
          </>
        )}
      </div>
    </div>
  )
}
