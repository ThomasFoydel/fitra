import React, { useEffect, useState, useContext, useRef } from 'react';
import axios from 'axios';
import { CTX } from 'context/Store';
import './ManageSession.scss';
import { Navigate, Link } from 'react-router-dom';
import Image from 'Components/Image/Image';
import { act } from '@testing-library/react';

const ManageSession = ({
  match: {
    params: { id },
  },
}) => {
  const [appState] = useContext(CTX);
  const [found, setFound] = useState(null);
  const [err, setErr] = useState('');
  const [openCancel, setOpenCancel] = useState(false);
  let { token } = appState.user;
  let [deleted, setDeleted] = useState(false);

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

  useEffect(() => {
    let subscribed = true;
    axios
      .get(`/api/trainer/session/${id}`, {
        headers: { 'x-auth-token': token },
      })
      .then(({ data: { foundSession, err, foundClient } }) => {
        if (subscribed)
          if (err) setErr(err);
          else if (process.env.NODE_ENV === 'production') {
            setFound({ session: foundSession, client: foundClient });
          } else {
            act(() => setFound({ session: foundSession, client: foundClient }));
          }
      });
    return () => (subscribed = false);
  }, [token, id]);

  const handleCancel = () => {
    axios
      .delete(`/api/trainer/cancel-session/`, {
        headers: { 'x-auth-token': token, id },
      })
      .then(({ data: { id, err } }) => {
        if (err) setErr(err);
        else if (id) setDeleted(true);
      })
      .catch((err) => console.log({ err }));
  };

  let { startTime, endTime, _id, client } = found ? found.session : {};
  let { name } = found ? found.client : {};
  let start = new Date(startTime);
  let end = new Date(endTime);
  let currentTime = new Date(Date.now());
  let started = currentTime > start;
  let ended = currentTime > end;
  let active = started && !ended;

  return (
    <div className='manage-session'>
      {deleted && <Navigate to='/coachportal/schedule' />}
      {found && (
        <>
          <Link to='/coachportal/schedule'>
            <i className='fas fa-angle-left fa-4x back-link'></i>
          </Link>
          <Link to={`/user/${client}`}>
            <Image
              name='profile-pic'
              alt="client's profile"
              src={`/api/image/user/profilePic/${client}`}
            />
          </Link>
          <Link to={`/user/${client}`}>
            <div className='name'>{name}</div>
          </Link>
          <div className='date'>{start && start.toLocaleDateString()}</div>
          <div className='start'>
            start: {start && start.toLocaleTimeString()}
          </div>
          <div className='end'>end: {end && end.toLocaleTimeString()}</div>
          {active && (
            <Link className='connect-link' to={`/connect/${_id}`}>
              connect
            </Link>
          )}
          <div className='err'>{err}</div>

          {openCancel ? (
            <div className='cancel'>
              <p>cancel this session?</p>
              <button
                className='close-btn'
                onClick={() => setOpenCancel(false)}
              >
                nevermind
              </button>
              <button className='confirm-btn' onClick={handleCancel}>
                confirm
              </button>
            </div>
          ) : (
            <button className='cancel-btn' onClick={() => setOpenCancel(true)}>
              cancel session
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default ManageSession;
