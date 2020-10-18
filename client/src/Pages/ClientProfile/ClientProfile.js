import React, { useState, useEffect, useContext } from 'react';
import './ClientProfile.scss';
import axios from 'axios';
import { CTX } from 'context/Store';

const ClientProfile = ({
  match: {
    params: { id },
  },
}) => {
  const [appState, updateState] = useContext(CTX);
  let { token } = appState.user;

  const [user, setUser] = useState({});
  const [err, setErr] = useState('');
  const [firstRender, setFirstRender] = useState(true);

  useEffect(() => {
    axios
      .get(`/api/client/profile/${id}`, { headers: { 'x-auth-token': token } })
      .then(({ data: { foundUser, err } }) => {
        if (err) setErr(err);
        else if (foundUser) setUser(foundUser);
      });
  }, []);
  useEffect(() => {
    if (firstRender) setFirstRender(false);
    else setTimeout(() => setErr(''), 2500);
  }, [err]);
  let { coverPic, profilePic, bio, name, email } = user;
  return (
    <div className='clientprofile'>
      <h2>ClientProfile</h2>

      <div
        className='cover-pic'
        style={{
          backgroundImage: coverPic
            ? ` linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.9)), url("/api/image/${coverPic}")`
            : '',
        }}
      >
        <div className='info'>
          <img className='profile-pic' src={`/api/image/${profilePic}`} />
          <div>
            <div className='name'>{name}</div>
            <div className='bio'>{bio}</div>
            <div className='email'>{email}</div>
          </div>
        </div>
      </div>

      <div className='err'>{err}</div>
    </div>
  );
};

export default ClientProfile;
