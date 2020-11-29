import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { CTX } from 'context/Store';
import { Link } from 'react-router-dom';
import './ManageSession.scss';
import { Redirect } from 'react-router-dom';
const ManageSession = ({
  match: {
    params: { id },
  },
}) => {
  const [appState, updateState] = useContext(CTX);
  const [found, setFound] = useState(null);
  const [err, setErr] = useState('');
  const [openCancel, setOpenCancel] = useState(false);
  let { token } = appState.user;
  let [firstRender, setFirstRender] = useState(true);
  let [deleted, setDeleted] = useState(false);

  useEffect(() => {
    let subscribed = true;
    if (!firstRender)
      setTimeout(() => {
        if (subscribed) setErr('');
      }, 2700);
    else setFirstRender(false);
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
  }, []);

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
          <img
            className='profile-pic'
            src={`/api/image/user/profilePic/${found.session.client}`}
          />
          <Link to={`/user/${found.client._id}`}>
            <div className='name'>{found.client.name}</div>
          </Link>
          <div className='email'>{found.client.email}</div>
          <div className='date'>{start && start.toDateString()}</div>
          <div className='start'>start: {start && start.toTimeString()}</div>
          <div className='end'>end: {end && end.toTimeString()}</div>
          <button onClick={() => setOpenCancel(true)}>cancel session</button>
          {openCancel && (
            <div className='cancel'>
              <p>cancel this session?</p>
              <button onClick={handleCancel}>confirm</button>
              <button onClick={() => setOpenCancel(false)}>close</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ManageSession;
