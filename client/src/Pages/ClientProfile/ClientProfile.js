import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { CTX } from 'context/Store';
import Image from 'Components/Image/Image';
import './ClientProfile.scss';

import { loadingSpin } from 'imgs/loading/spin.gif';

const ClientProfile = ({
  match: {
    params: { id },
  },
}) => {
  const [appState] = useContext(CTX);
  let { token } = appState.user;
  let belongsToCurrentUser = appState.user.id === id;

  const [user, setUser] = useState({});
  const [err, setErr] = useState('');

  useEffect(() => {
    let subscribed = true;
    axios
      .get(`/api/client/profile/${id}`, { headers: { 'x-auth-token': token } })
      .then(({ data: { foundUser, err } }) => {
        if (err && subscribed) setErr(err);
        else if (foundUser && subscribed) setUser(foundUser);
      });
    return () => (subscribed = false);
  }, [id, token]);

  const didMountRef = useRef(false);
  useEffect(() => {
    let subscribed = true;
    if (didMountRef.current) {
      setTimeout(() => {
        if (subscribed) setErr('');
      }, 2700);
    } else didMountRef.current = true;
    return () => (subscribed = false);
  }, [err]);

  let { coverPic, profilePic, bio, name, displayEmail } = user;
  return (
    <div className='clientprofile'>
      <div
        className='cover-pic'
        style={{
          backgroundImage: coverPic
            ? ` linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.9)), url("/api/image/${coverPic}")`
            : '',
        }}
      >
        <div className='info'>
          <Image
            src={profilePic ? `/api/image/${profilePic}` : loadingSpin}
            alt="user's profile"
            name='profile-pic'
          />
          <div className='section-1'>
            <div className='name'>{name}</div>
            <div className='bio'>{bio}</div>
            <div className='email'>{displayEmail}</div>
            {belongsToCurrentUser && (
              <Link to={`/editprofile`} className='link'>
                edit profile
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className='err'>{err}</div>
    </div>
  );
};

export default ClientProfile;
