import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { CTX } from 'context/Store';
import './Home.scss';

import { config, animated, useTransition } from 'react-spring';

import Session from './Session';

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

  const animation = useTransition(sessions, (item) => item._id, {
    from: { opacity: '0', transform: 'translateY(-20px)' },
    enter: { opacity: '1', transform: 'translateY(0px)' },
    leave: { opacity: '0', transform: 'translateY(-20px)' },
    trail: 200,
    config: config.wobbly,
  });

  console.log(sessions);
  return (
    <>
      <div className='background' />
      <div className='overlay' />
      <div className='home'>
        <h2>{type === 'trainer' ? 'sessions' : 'schedule'}</h2>
        <div className='sessions'>
          {sessions.length > 0 &&
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

export default Home;
