import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './EditProfile.scss';
import { CTX } from 'context/Store';
import ImageUploader from 'Components/ImageUploader/ImageUploader';

// TODOS
// Replace default picture ids

const EditProfile = () => {
  const [appState, updateState] = useContext(CTX);
  const { type } = appState.user;
  let { token, coverPic, profilePic, name, bio, email, id } = appState.user;
  const [formInfo, setFormInfo] = useState({
    name: name || '',
    bio: bio || '',
    email: email || '',
  });

  const handleChange = (e) => {
    let { id, value } = e.target;
    setFormInfo({ ...formInfo, [id]: value });
  };
  // const resetForm = () => {
  //   setFormInfo({name: "", bio: "", email:""})
  // }

  const handleSubmit = () => {
    axios
      .post(`/api/${type}/editprofile`, formInfo, {
        headers: { 'x-auth-token': token },
      })
      .then(({ data: { bio, coverPic, email, name, profilePic } }) => {
        let filteredRes = { bio, coverPic, email, name, profilePic };
        updateState({ type: 'EDIT_PROFILE', payload: { res: filteredRes } });
        setFormInfo({ name: '', bio: '', email: '' });
      })
      .catch((err) => console.log('err: ', err));
  };
  return (
    <div className='edit-profile'>
      <h2>edit your profile</h2>
      <Link
        className='link'
        to={`${type === 'trainer' ? '/trainer' : '/user'}/${id}`}
      >
        back to my profile
      </Link>
      <input
        type='text'
        id='name'
        onChange={handleChange}
        placeholder={name || 'name...'}
        value={formInfo.name}
      />
      <input
        type='text'
        id='bio'
        onChange={handleChange}
        placeholder={bio || 'bio...'}
        value={formInfo.bio}
      />
      <input
        type='email'
        id='email'
        onChange={handleChange}
        placeholder={email || 'email...'}
        value={formInfo.email}
      />
      <button onClick={handleSubmit}>submit</button>
      <div className='image-uploaders'>
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
