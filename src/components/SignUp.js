import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {Image} from 'cloudinary-react';
import '../styles/SignUp.css';
import { useNavigate } from 'react-router-dom';

export default function SignUp({state, setState}) {
  const [errorMessage, setErrorMessage] = useState('none');
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [bio, setBio] = useState('');
  const [imageURL, setImageURL] = useState('');
  const [bioCharacterCount, setBioCharacterCount] = useState(0);
  const navigate = useNavigate();
  
  const defaultProfilePictureURL = 'https://res.cloudinary.com/dnggclzfd/image/upload/v1669373719/zlhbakiprwuv8hipf2c7.png';

  const uploadImage = (image) => {
    const formData = new FormData();
    formData.append('file', image);
    formData.append('upload_preset', 'pho9c5mj');

    axios.post('https://api.cloudinary.com/v1_1/dnggclzfd/image/upload', formData)
    .then(res => {
      setImageURL(res.data.url);
    })
    .catch(err => {
      console.error(err.message);
    })
  };

  const errorAfterLoading = (errMsg) => {
    setTimeout(() => {
      setLoading(false);
      setErrorMessage(errMsg);
    }, 1000)
  }

  const blankError = (blankInput) => {
    setLoading(true);
      errorAfterLoading(`${blankInput} cannot be blank.`);
      setTimeout(() => {
        setErrorMessage('none');
      }, 3000);
  }

  const signup = () => {
    if(password !== confirmPassword) {
      setLoading(true);
      errorAfterLoading('The Two Passwords Given Do Not Match.');
      setTimeout(() => {
        setErrorMessage('none');
      }, 3000);
      return;
    }
    if(name === '') {
      blankError('name');
      return;
    }
    if(email === '') {
      blankError('email');
      return;
    }
    if(password === '') {
      blankError('password');
      return;
    }
    if(bioCharacterCount > 100) {
      setLoading(true);
      errorAfterLoading('Bio Must Be 100 Characters or Less.');
      setTimeout(() => {
        setErrorMessage('none');
      },3000)
      return;
    }
    setLoading(true);
    const signupObject = {name, email, password, bio, imageURL: (imageURL || defaultProfilePictureURL)};
    axios.post('https://daylee-backend.onrender.com/users/signup', signupObject)
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
    <div className='signup'>
      <div className='signup__paddingContainer'></div>

      <div className='signup__notImageContainer'>
        {loading && <div className='signup__spinner'></div>}

        <h2
          className={errorMessage === 'none' ? 'signup__error hide' : 'signup__error'}
        >{errorMessage}</h2>
          
        <div className='signup__pictureContainer signup__pictureContainerMobile'>
          <h2 className='signup__title signup__titleMobile'>Sign Up:</h2>

          <h2 className='signup__pickProfilePictureTitle'>Select a Profile Image:</h2>
          
          <div className='signup__profilePictureContainer'>
            <input
              className='signup__findImageButtons'
              type='file'
              onChange={(e) => {
                uploadImage(e.target.files[0])
              }}
            ></input>

            <div className='signup__imageContainer'>
              <Image
                className='signup__profilePicturePreview'
                cloudName='dnggclzfd'
                publicId={imageURL || defaultProfilePictureURL}
              />
            </div>
          </div>
        </div>  

        <div className='signup__inputsContainer'>
          <h2 className='signup__title signup__titleDesktop'>Sign Up:</h2>

          <input
            className='signup__input singup__input--name'
            value={name}
            onChange={e => {setName(e.target.value)}}
            placeholder='name'
            type='text'
            required
          ></input>

          <input
            className='signup__input signup__input--email'
            value={email}
            onChange={e => {setEmail(e.target.value)}}
            placeholder='email'
            type='email'
            required
          ></input>

          <input
            className='signup__input signup__input--password'
            value={password}
            onChange={e => {setPassword(e.target.value)}}
            placeholder='password'
            type='password'
            required
          ></input>

          <input
            className='signup__input signup__input--confirmPassword'
            value={confirmPassword}
            onChange={e => {setConfirmPassword(e.target.value)}}
            placeholder='confirm password'
            type='password'
            required
          ></input>

          <textarea
            className='signup__input signup__input--bio'
            value={bio}
            onChange={e => {
              setBio(e.target.value);
              setBioCharacterCount(e.target.value.length);
            }}
            placeholder='write a short bio for yourself.'
            type='text'
          ></textarea>
          <h3 
            className={bioCharacterCount > 100 ? 'signup__bioCharacterCount red' :'signup__bioCharacterCount'}
          >{`${bioCharacterCount} / 100`}</h3>

          <button
            className='signup__submit'
            onClick={signup}
          >Sign Up</button>
        </div>
      </div>

      <div className='signup__pictureContainer signup__pictureContainerDesktop'>
        <h2 className='signup__pickProfilePictureTitle'>Select a Profile Image:</h2>
        <div className='signup__profilePictureContainer'>
          <input
            className='signup__findImageButtons'
            type='file'
            onChange={(e) => {
              uploadImage(e.target.files[0])
            }}
          ></input>

          <div className='signup__imageContainer'>
            <Image
              className='signup__profilePicturePreview'
              cloudName='dnggclzfd'
              publicId={imageURL || defaultProfilePictureURL}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
