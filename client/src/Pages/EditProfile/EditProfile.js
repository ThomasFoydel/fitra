import React, { useState, useContext } from 'react';
import axios from 'axios';
import './EditProfile.scss';
import { CTX } from 'context/Store';
import ImageUploader from 'Components/ImageUploader/ImageUploader';

// TODOS
// Replace default picture ids

const EditProfile = () => {
  const [appState, updateState] = useContext(CTX);
  const { type } = appState.user;
  let { token, coverPic, profilePic, name, bio, email } = appState.user;
  const [formInfo, setFormInfo] = useState({});

  const handleChange = (e) => {
    let { id, value } = e.target;
    setFormInfo({ ...formInfo, [id]: value });
  };

  const handleSubmit = () => {
    axios
      .post(`/api/${type}/editprofile`, formInfo, {
        headers: { 'x-auth-token': token },
      })
      .then((res) => console.log('edit profile res: ', res))
      .catch((err) => console.log('err: ', err));
  };
  console.log('USERL', appState.user);
  return (
    <div className='edit-profile'>
      <h2>edit your profile</h2>
      <input
        type='text'
        id='name'
        onChange={handleChange}
        placeholder={name || 'name...'}
      />
      <input
        type='text'
        id='bio'
        onChange={handleChange}
        placeholder={bio || 'bio...'}
      />
      <input
        type='email'
        id='email'
        onChange={handleChange}
        placeholder={email || 'email...'}
      />
      <button onClick={handleSubmit}>submit</button>
      <div className='flex'>
        <div>
          <img
            className='edit-pic'
            src={`/api/image/${profilePic || '5f4d8786efa2ae10b38bfe9e'}`}
          />
          <ImageUploader kind='profilePic' />
        </div>
        <div>
          <img
            className='edit-pic'
            src={`/api/image/${coverPic || '5f4d8786efa2ae10b38bfe9e'}`}
          />
          <ImageUploader kind='coverPic' />
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
