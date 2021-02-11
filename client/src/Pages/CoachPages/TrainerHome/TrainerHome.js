import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { config, animated, useTransition } from 'react-spring';
import Session from './Session';
import { CTX } from 'context/Store';
import './TrainerHome.scss';
import { act } from '@testing-library/react';

const TrainerHome = () => {
  const [appState] = useContext(CTX);
  const { type } = appState.user;
  const [foundSessions, setFoundSessions] = useState([]);
  let { token } = appState.user;

  useEffect(() => {
    let subscribed = true;
    axios
      .get(`/api/${type}/dashboard`, { headers: { 'x-auth-token': token } })
      .then(({ data: { sessions } }) => {
        if (subscribed)
          process.env.NODE_ENV === 'production'
            ? setFoundSessions(sessions)
            : act(() => setFoundSessions(sessions));
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
        <h2>Sessions</h2>
        <div className='sessions'>
          {foundSessions.length > 0 ? (
            animation.map(({ item, props, key }) => (
              <animated.div style={props} key={key}>
                <Session session={item} />
              </animated.div>
            ))
          ) : (
            <h3>no recent or upcoming sessions</h3>
          )}
        </div>
      </div>
    </>
  );
};

export default TrainerHome;
