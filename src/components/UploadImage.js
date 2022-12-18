import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {Image} from 'cloudinary-react';

export default function UploadImage({}) {
  const [imageSelected, setImageSelected] = useState({});
  const [imageURL, setImageURL] = useState('');

  const uploadImage = (files) => {
    const formData = new FormData();
    formData.append('file', imageSelected);
    formData.append('upload_preset', 'pho9c5mj');

    axios.post('https://api.cloudinary.com/v1_1/dnggclzfd/image/upload', formData)
    .then(res => {
      setImageURL(res.data.url);
    })
    .catch(err => {
      console.error(err.message);
    })
  };

  return (
    <div>
      <input 
        type='file'
        onChange={(e) => {
          setImageSelected(e.target.files[0])
        }}
      ></input>
      <button
        onClick={uploadImage}
      >Upload Image</button>

      <Image 
        cloudName='dnggclzfd'
        publicId={imageURL}
      />
    </div>
  )
}