import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Image from 'Components/Image/Image';
import { CTX } from 'context/Store';
import './Home.scss';

const Home = () => {
  const [appState] = useContext(CTX);
  const { type } = appState.user;
  const [sessions, setFoundSessions] = useState([]);
  let { token } = appState.user;
  useEffect(() => {
    let subscribed = true;
    if (token)
      axios
        .get(`/api/${type}/dashboard`, { headers: { 'x-auth-token': token } })
        .then(({ data: { sessions } }) => {
          if (subscribed) setFoundSessions(sessions);
        })
        .catch((err) => console.log('connection error: ', err));
    return () => (subscribed = false);
  }, [token, type]);

  return (
    <>
      <div className='background' />
      <div className='overlay' />
      <div className='home'>
        <h2>{type === 'trainer' ? 'sessions' : 'schedule'}</h2>
        <div className='sessions'>
          {sessions &&
            sessions.map((session) => (
              <Session session={session} key={session._id} />
            ))}
        </div>
      </div>
    </>
  );
};

const Session = ({ session }) => {
  let { startTime, endTime, _id, trainer, status } = session;
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
      <Image
        name='profile-pic'
        src={`/api/image/user/profilePic/${trainer}`}
        alt="trainer's profile"
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
      {ended && status !== 'reviewed' && (
        <Link to={`/review/${_id}`}>review</Link>
      )}
    </div>
  );
};

export default Home;
