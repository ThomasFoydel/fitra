import React, { useContext, useEffect, useState } from 'react';
import './TrainerHome.scss';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { CTX } from 'context/Store';
import Image from 'Components/Image/Image';

const TrainerHome = () => {
  const [appState, updateState] = useContext(CTX);
  const { type } = appState.user;
  const [foundSessions, setFoundSessions] = useState([]);
  let { token } = appState.user;
  useEffect(() => {
    let subscribed = true;
    axios
      .get(`/api/${type}/dashboard`, { headers: { 'x-auth-token': token } })
      .then(({ data: { sessions } }) => {
        console.log({ sessions });
        if (subscribed) setFoundSessions(sessions);
      })
      .catch((err) => console.log('connection error: ', err));
    return () => (subscribed = false);
  }, []);
  console.log({ type });
  return (
    <>
      <div className='background' />
      <div className='overlay' />
      <div className='trainer-home'>
        <h2>{type === 'trainer' ? 'sessions' : 'schedule'}</h2>
        <div className='session'>
          {foundSessions &&
            foundSessions.map((session) => (
              <Session session={session} key={session._id} />
            ))}
        </div>
      </div>
    </>
  );
};

const Session = ({ session }) => {
  let { startTime, endTime, _id, client, trainer } = session;
  let startDate = new Date(startTime);
  let endDate = new Date(endTime);
  // todo: account for dates being stored as GMT, and currentTime being in localTime
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
      <Image
        name='profile-pic'
        src={`/api/image/user/profilePic/${client}`}
        alt="client's profile"
      />
      <div className='start-time'>
        <strong>start: </strong>
        {startDate.toDateString()} {startDate.toLocaleTimeString()}
      </div>
      <div className='end-time'>
        <strong>end: </strong>
        {endDate.toDateString()} {endDate.toLocaleTimeString()}
      </div>
      {active && <Link to={`/connect/${_id}`}>connect</Link>}
    </div>
  );
};

export default TrainerHome;
