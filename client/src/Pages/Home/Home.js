import React, { useContext, useEffect, useState } from 'react';
import './Home.scss';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { CTX } from 'context/Store';

const Home = () => {
  const [appState, updateState] = useContext(CTX);
  const { type } = appState.user;
  const [appts, setAppts] = useState([]);
  let { token } = appState.user;
  useEffect(() => {
    let subscribed = true;
    axios
      .get(`/api/${type}/dashboard`, { headers: { 'x-auth-token': token } })
      .then(({ data: { appointments } }) => {
        if (subscribed) setAppts(appointments);
      })
      .catch((err) => console.log('connection error: ', err));
    return () => (subscribed = false);
  }, []);
  return (
    <>
      <div className='background' />
      <div className='overlay' />
      <div className='home'>
        <h2>schedule</h2>
        <div className='appts'>
          {appts &&
            appts.map((appt) => <Appointment appt={appt} key={appt._id} />)}
        </div>
      </div>
    </>
  );
};

const Appointment = ({ appt }) => {
  let { startTime, endTime, _id, client, trainer } = appt;
  let startDate = new Date(startTime);
  let endDate = new Date(endTime);
  let currentTime = new Date(Date.now());
  let started = currentTime > startDate;
  let ended = currentTime > endDate;
  let active = started && !ended;

  return (
    <div
      className={`appointment 
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

export default Home;
