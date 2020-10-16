import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { CTX } from 'context/Store';
import './ManageAppt.scss';
const ManageAppt = ({
  match: {
    params: { id },
  },
}) => {
  const [appState, updateState] = useContext(CTX);
  const [found, setFound] = useState(null);
  const [err, setErr] = useState('');
  let { token } = appState.user;
  let [firstRender, setFirstRender] = useState(true);

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
        // console.log({ foundAppointment, err });
        if (subscribed)
          if (err) setErr(err);
          else setFound({ appt: foundAppointment, client: foundClient });
      });
    return () => (subscribed = false);
  }, []);

  return (
    <div className='manage-appt'>
      {found && (
        <>
          <img
            className='profile-pic'
            src={`/api/image/user/profilePic/${found.appt.client}`}
          />
          <div className='name'>{found.client.name}</div>
          {/* <img src={`/api/image/user/profilePic/`} alt='client' /> */}
          <div className='start'>
            {new Date(found.appt.startTime).toDateString()}
          </div>
          <div className='end'>
            {new Date(found.appt.endTime).toDateString()}
          </div>
        </>
      )}
    </div>
  );
};

export default ManageAppt;
