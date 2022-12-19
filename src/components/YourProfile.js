import React, {useState, useEffect, useRef} from 'react';
import '../styles/YourProfile.css';
import {Image} from 'cloudinary-react';
import axios from 'axios';

export default function YourProfile({state, setState}) {
  const [changeImage, setChangeImage] = useState(false);
  const [changeName, setChangeName] = useState(false);
  const [changeBio, setChangeBio] = useState(false);
  const [imageURL, setImageURL] = useState(state.user.image);
  const [name, setName] = useState(state.user.name);
  const [bio, setBio] = useState(state.user.bio);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('none');
  const [bioCharacterCount, setBioCharacterCount] = useState(state.user.bio.length);
  const bottomRef = useRef();

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
    }, 800)
  }

  const changeProfile = (type, content) => {
    if (type === 'image' && imageURL === state.user.image) {
      setChangeImage(false);
      return;
    }

    if (type === 'image' && imageURL === '') {
      setLoading(true);
      errorAfterLoading('No Image Was Given.');
      setTimeout(() => {
        setErrorMessage('none');
      }, 3000);
      return;
    }

    if (type ==='name' && (name === state.user.name)) {
      setChangeName(false);
      return;
    }

    if (type === 'name' && name === '') {
      setLoading(true);
      errorAfterLoading('Name Cannot Be Blank.');
      setTimeout(() => {
        setErrorMessage('none');
      }, 3000);
      return;
    }

    if (type === 'bio' && bio === state.user.bio) {
      setChangeBio(false);
      return;
    }

    if (bio.length > 100) {
      setLoading(true);
      errorAfterLoading('Bio Must Be 100 Characters or Less.');
      setTimeout(() => {
        setErrorMessage('none');
      },3000)
      return;
    }

    axios.post(`https://daylee-backend.onrender.com/users/change/${type}`, {content, userID: state.user.id})
      .then(res => {
        const result = res.data[0];
        setLoading(true);
        if(result.type === 'image') {
          setState(prev => ({...prev, user: {...state.user, image: result.image}}));
          setTimeout(() => {
            setLoading(false);
            setChangeImage(false);
          }, 800);
          return;
        }
        if(result.type === 'name') {
          setState(prev => ({...prev, user: {...state.user, name: result.name}}));
          setTimeout(() => {
            setLoading(false);
            setChangeName(false);
          }, 800);
          return;
        }
        if(result.type === 'bio') {
          setState(prev => ({...prev, user: {...state.user, bio: result.bio}}));
          setTimeout(() => {
            setLoading(false);
            setChangeBio(false);
          }, 800);
        }
      })
      .catch(err => {
        console.error(err.message);
      })
  };

  const scrollDown = () => {
    bottomRef.current.scrollIntoView();
  }

  return (
    <div className='profile'>
      {loading && <div className='profile__spinner'></div>}

      <h2
        className={errorMessage === 'none' ? 'profile__error hide' : 'profile__error'}
      >{errorMessage}</h2>

      <div className='profile__imageContainer'>
        {changeImage ? (
          <div className='profile__imageEdit'>
            <div className='profile__changePictureContainer hide profile__changePictureContainerDud'>
              <input
                className='profile__chooseNewPicture'
                type='file'
              ></input>

              <div className='profile__buttonContainer'>
                <button
                  className='profile__button profile__button--cancel'
                >cancel</button>
                <button
                  className='profile__button profile__button--confirm'
                >confirm</button>
              </div>
            </div>

            <Image
              className='profile__image'
              cloudName='dnggclzfd'
              publicId={imageURL || state.user.image}
            />

            <div className='profile__changePictureContainer'>
              <input
                className='profile__chooseNewPicture'
                type='file'
                onChange={(e) => {
                  uploadImage(e.target.files[0])
                }}
              ></input>
              
              <div className='profile__buttonContainer'>
                <button
                  className='profile__button profile__button--cancel'
                  onClick={() => {
                    setImageURL('');
                    setChangeImage(false);
                  }}
                >cancel</button>
                <button
                  className='profile__button profile__button--confirm'
                  onClick={() => {changeProfile('image', imageURL)}}
                >confirm</button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <i class="fa-solid fa-pen-to-square profile__imageIcon hide"></i>
            <Image
              className='profile__image'
              cloudName='dnggclzfd'
              publicId={state.user.image}
            />
            <i 
              class="fa-solid fa-pen-to-square profile__imageIcon"  
              onClick={() => setChangeImage(true)}
            ></i>
          </>
        )}
      </div>
      
      {changeName ? (
        <div>
          <div className='profile__nameContainer'>
            <h5 className='profile__title'>name:</h5>

            <div className='profile__nameContentContainer'>
              <div className='profile__buttonContainer hide profile__buttonContainerDud'>
                <button
                  className='profile__button profile__button--cancel'
                >cancel</button>
                <button
                  className='profile__button profile__button--confirm'
                >confirm</button>
              </div>

              <input 
                className='profile__changeInput profile__changeInput--name'
                value={name === undefined ? state.user.name : name}
                onChange={(e) => {setName(e.target.value)}}
              ></input>

              <div className='profile__buttonContainer'>
                <button
                  className='profile__button profile__button--cancel'
                  onClick={() => {
                    setName(state.user.name);
                    setChangeName(false);
                  }}
                >cancel</button>
                <button
                  className='profile__button profile__button--confirm'
                  onClick={() => {changeProfile('name', name)}}
                >confirm</button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className='profile__nameContainer'>
            <h5 className='profile__title'>name:</h5>

            <div className='profile__nameContentContainer'>
              <i class="fa-solid fa-pen-to-square profile__icon hide"></i>

              <h2 className='profile__info'>{state.user.name}</h2>
              
              <i
                class="fa-solid fa-pen-to-square profile__icon"
                onClick={() => setChangeName(true)}
              ></i>
            </div>
          </div>
        </div>
      )}
      
      <h5 className='profile__title'>email:</h5>
      <h2 className='profile__info'>{state.user.email}</h2>

      {changeBio ? (
        <div className='profile__bioContainer'>
          <h5 className='profile__title'>bio:</h5>
          <div class='profile__bioContentContainer'>
            <div className='profile__buttonContainer hide profile__buttonContainerDud'>
              <button
                className='profile__button profile__button--cancel'
              >cancel</button>
              <button
                className='profile__button profile__button--confirm'
              >confirm</button>
            </div>

            <div className='profile__editBioContainer'>
              <textarea 
                className='profile__changeInput profile__changeInput--bio'
                value={bio === undefined ? state.user.bio : bio}
                onChange={(e) => {
                  setBio(e.target.value);
                  setBioCharacterCount(e.target.value.length);
                }}
              ></textarea>
              <h3 
                className={bioCharacterCount > 100 ? 'profile__bioCharacterCount red' :'profile__bioCharacterCount'}
              >{`${bioCharacterCount} / 100`}</h3>
            </div>

            <div className='profile__buttonContainer'>
              <button
                className='profile__button profile__button--cancel'
                onClick={() => {
                  setBio(state.user.bio);
                  setChangeBio(false);
                }}
              >cancel</button>
              <button
                className='profile__button profile__button--confirm'
                onClick={() => {changeProfile('bio', bio)}}
              >confirm</button>
            </div>
          </div>
        </div>
      ) : (
        <div className='profile__bioContainer'>
          <h5 className='profile__title'>bio:</h5>
          <div class='profile__bioContentContainerNoEdit'>
            <i class="fa-solid fa-pen-to-square profile__icon hide"></i>

            <h2 className='profile__info profile__info--bio'>{state.user.bio}</h2>

            <i
              class="fa-solid fa-pen-to-square profile__icon"
              onClick={() => {
                setChangeBio(true);
                scrollDown();        
              }}
            ></i>
          </div>
        </div>
      )}
    <div className="bottomContainerElement" ref={bottomRef} />
    </div>
  )
}
