import React, { useEffect, useState, useContext, useRef } from 'react';
import axios from 'axios';
import { CTX } from 'context/Store';
import { Link } from 'react-router-dom';
import './ManageSession.scss';
import { Redirect } from 'react-router-dom';
import Image from 'Components/Image/Image';

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
          else setFound({ session: foundSession, client: foundClient });
      });
    return () => (subscribed = false);
  }, [token, id]);

  const handleCancel = () => {
    axios
      .post(
        `/api/trainer/cancel-session/`,
        { id },
        {
          headers: { 'x-auth-token': token },
        }
      )
      .then(({ data: { id, err } }) => {
        if (err) setErr(err);
        else if (id) setDeleted(true);
      })
      .catch((err) => console.log({ err }));
  };

  let start = found && new Date(found.session.startTime);
  let end = found && new Date(found.session.endTime);
  return (
    <div className='manage-session'>
      {deleted && <Redirect to='/coachportal/schedule' />}
      {found && (
        <>
          <Link to='/coachportal/schedule'>
            <i className='fas fa-angle-left fa-4x back-link'></i>
          </Link>
          <Link to={`/user/${found.client._id}`}>
            <Image
              name='profile-pic'
              alt="client's profile"
              src={`/api/image/user/profilePic/${found.session.client}`}
            />
          </Link>
          <Link to={`/user/${found.client._id}`}>
            <div className='name'>{found.client.name}</div>
          </Link>
          <div className='email'>{found.client.email}</div>
          <div className='date'>{start && start.toDateString()}</div>
          <div className='start'>start: {start && start.toTimeString()}</div>
          <div className='end'>end: {end && end.toTimeString()}</div>
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
