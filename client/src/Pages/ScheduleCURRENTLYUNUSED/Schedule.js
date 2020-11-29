import React, { useState, useEffect, useContext } from 'react';
import { CTX } from 'context/Store';
import './Schedule.scss';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Schedule = () => {
  const [appState, updateState] = useContext(CTX);
  const { type } = appState.user;
  const [sessions, setFoundSessions] = useState([]);
  let { token } = appState.user;
  useEffect(() => {
    let subscribed = true;
    axios
      .get(`/api/${type}/dashboard`, { headers: { 'x-auth-token': token } })
      .then(({ data: { sessions } }) => {
        if (subscribed) setFoundSessions(sessions);
      })
      .catch((err) => console.log('connection error: ', err));
    return () => (subscribed = false);
  }, []);

  return (
    <div className='schedule'>
      <div className='background' />
      <div className='overlay' />
      {/* <h1 className='header center'>Schedule</h1> */}

      <div className='home center'>
        <h2>schedule</h2>
        <div className='sessions'>
          {sessions &&
            sessions.map((session) => (
              <Session session={session} key={session._id} />
            ))}
        </div>
      </div>
    </div>
  );
};

const Session = ({ session }) => {
  let { startTime, endTime, _id, client, trainer } = session;
  let startDate = new Date(startTime);
  let endDate = new Date(endTime);
  let currentTime = new Date(Date.now());
  let started = currentTime > startDate;
  let ended = currentTime > endDate;
  let active = started && !ended;

  return (
    <div
      className={`session 
      ${ended && ' ended '}
      ${active && ' active '} 
      ${!started && ' not-started '} 
      `}
    >
      <img
        className='profile-pic'
        src={`/api/image/user/profilePic/${trainer}`}
      />
      <div className='start-time'>
        <strong>start: </strong>
        {startDate.toUTCString()}
      </div>
      <div className='end-time'>
        <strong>end: </strong>
        {endDate.toUTCString()}
      </div>
      {active && <Link to={`/connect/${_id}`}>connect</Link>}
    </div>
  );
};

export default Schedule;
