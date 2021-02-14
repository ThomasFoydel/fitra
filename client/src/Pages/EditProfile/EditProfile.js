import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './EditProfile.scss';
import { CTX } from 'context/Store';
import ImageUploader from 'Components/ImageUploader/ImageUploader';
import Image from 'Components/Image/Image';
import { act } from '@testing-library/react';

const EditProfile = () => {
  const [appState, updateState] = useContext(CTX);
  const { type } = appState.user;
  let {
    token,
    coverPic,
    profilePic,
    name,
    bio,
    displayEmail,
    id,
  } = appState.user;
  const [formInfo, setFormInfo] = useState({
    name: name || '',
    bio: bio || '',
    displayEmail: displayEmail || '',
  });

  const handleChange = (e) => {
    let { id, value } = e.target;
    setFormInfo({ ...formInfo, [id]: value });
  };

  const handleSubmit = () => {
    axios
      .put(`/api/${type}/editprofile`, formInfo, {
        headers: { 'x-auth-token': token },
      })
      .then(({ data: { bio, coverPic, displayEmail, name, profilePic } }) => {
        let filteredRes = { bio, coverPic, displayEmail, name, profilePic };
        if (process.env.NODE_ENV === 'production') {
          updateState({
            type: 'EDIT_PROFILE',
            payload: { res: filteredRes },
          });
          setFormInfo({ name: '', bio: '', displayEmail: '' });
        } else {
          act(() => {
            updateState({
              type: 'EDIT_PROFILE',
              payload: { res: filteredRes },
            });
            setFormInfo({ name: '', bio: '', displayEmail: '' });
          });
        }
      })
      .catch((err) => console.log('err: ', err));
  };
  return (
    <>
      <div className='background' />
      <div className='edit-profile'>
        <h2>Edit your profile</h2>
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
          type='displayEmail'
          id='displayEmail'
          onChange={handleChange}
          placeholder={displayEmail || 'display email...'}
          value={formInfo.displayEmail}
        />
        <button className='submit-btn' onClick={handleSubmit}>
          submit
        </button>
        <div className='image-uploaders'>
          <div className='uploader'>
            <Image
              name='edit-pic'
              src={`/api/image/${profilePic || '5f4d8786efa2ae10b38bfe9e'}`}
              alt='your profile'
            />
            <ImageUploader props={{ kind: 'profilePic' }} />
          </div>
          <div className='uploader'>
            <Image
              name='edit-pic'
              src={`/api/image/${coverPic || '5f4d8786efa2ae10b38bfe9e'}`}
              alt='your cover'
            />
            <ImageUploader props={{ kind: 'coverPic' }} />
          </div>
        </div>
      </div>
    </>
  );
};

export default EditProfile;
