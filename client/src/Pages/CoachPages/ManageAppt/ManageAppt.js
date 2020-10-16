import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { CTX } from 'context/Store';
import './ManageAppt.scss';
import { Redirect } from 'react-router-dom';
const ManageAppt = ({
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
      .get(`/api/trainer/appointment/${id}`, {
        headers: { 'x-auth-token': token },
      })
      .then(({ data: { foundAppointment, err, foundClient } }) => {
        if (subscribed)
          if (err) setErr(err);
          else setFound({ appt: foundAppointment, client: foundClient });
      });
    return () => (subscribed = false);
  }, []);

  const handleCancel = () => {
    axios
      .post(
        `/api/trainer/cancel-appointment/`,
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

  let start = found && new Date(found.appt.startTime);
  let end = found && new Date(found.appt.endTime);
  return (
    <div className='manage-appt'>
      {deleted && <Redirect to='/coachportal/schedule' />}
      {found && (
        <>
          <img
            className='profile-pic'
            src={`/api/image/user/profilePic/${found.appt.client}`}
          />
          <div className='name'>{found.client.name}</div>
          <div className='email'>{found.client.email}</div>
          <div className='date'>{start && start.toDateString()}</div>
          <div className='start'>start: {start && start.toTimeString()}</div>
          <div className='end'>end: {end && end.toTimeString()}</div>
          <button onClick={() => setOpenCancel(true)}>
            cancel appointment
          </button>
          {openCancel && (
            <div className='cancel'>
              <p>cancel this appointment?</p>
              <button onClick={handleCancel}>confirm</button>
              <button onClick={() => setOpenCancel(false)}>close</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ManageAppt;
