import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { CTX } from 'context/Store';
import Image from 'Components/Image/Image';
import './ClientProfile.scss';

const ClientProfile = ({
  match: {
    params: { id },
  },
}) => {
  const [appState, updateState] = useContext(CTX);
  let { token } = appState.user;
  let belongsToCurrentUser = appState.user.id === id;

  const [user, setUser] = useState({});
  const [err, setErr] = useState('');
  const [firstRender, setFirstRender] = useState(true);

  useEffect(() => {
    let subscribed = true;
    axios
      .get(`/api/client/profile/${id}`, { headers: { 'x-auth-token': token } })
      .then(({ data: { foundUser, err } }) => {
        if (err && subscribed) setErr(err);
        else if (foundUser && subscribed) setUser(foundUser);
      });
    return () => (subscribed = false);
  }, []);
  useEffect(() => {
    let subscribed = true;
    if (firstRender && subscribed) setFirstRender(false);
    else setTimeout(() => subscribed && setErr(''), 2500);
    return () => (subscribed = false);
  }, [err]);
  let { coverPic, profilePic, bio, name, email } = user;
  return (
    <div className='clientprofile'>
      {/* {!belongsToCurrentUser && <button></button>} */}
      <div
        className='cover-pic'
        style={{
          backgroundImage: coverPic
            ? ` linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.9)), url("/api/image/${coverPic}")`
            : '',
        }}
      >
        <div className='info'>
          <Image src={`/api/image/${profilePic}`} name='profile-pic' />
          <div>
            <div className='name'>{name}</div>
            <div className='bio'>{bio}</div>
            <div className='email'>{email}</div>
            {belongsToCurrentUser && (
              <Link to={`/editprofile`} className='link'>
                Edit Profile
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
