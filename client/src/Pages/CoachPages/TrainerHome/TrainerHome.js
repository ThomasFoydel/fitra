import React, { useContext, useEffect, useState } from 'react';
import './TrainerHome.scss';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { CTX } from 'context/Store';
import Image from 'Components/Image/Image';

import { config, animated, useTransition } from 'react-spring';

const TrainerHome = () => {
  const [appState] = useContext(CTX);
  const { type } = appState.user;
  const [foundSessions, setFoundSessions] = useState([]);
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

  const animation = useTransition(foundSessions, (item) => item._id, {
    from: { opacity: '0', transform: 'translateY(-20px)' },
    enter: { opacity: '1', transform: 'translateY(0px)' },
    leave: { opacity: '0', transform: 'translateY(-20px)' },
    trail: 200,
    config: config.wobbly,
  });

  return (
    <>
      <div className='background' />
      <div className='overlay' />
      <div className='trainer-home'>
        <h2>{type === 'trainer' ? 'sessions' : 'schedule'}</h2>
        <div className='sessions'>
          {foundSessions.length > 0 &&
            animation.map(({ item, props, key }) => (
              <animated.div style={props} key={key}>
                <Session session={item} />
              </animated.div>
            ))}
        </div>
      </div>
    </>
  );
};

const Session = ({ session }) => {
  let { startTime, endTime, _id, client } = session;
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
      <Link to={`/user/${client}`}>
        <Image
          name='profile-pic'
          src={`/api/image/user/profilePic/${client}`}
          alt="client's profile"
        />
      </Link>
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
