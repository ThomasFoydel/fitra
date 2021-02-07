import React from 'react';
import { Link } from 'react-router-dom';
import Image from 'Components/Image/Image';

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
        <span data-testid='trainer-home-session-start'>
          {startDate.toDateString()} {startDate.toLocaleTimeString()}
        </span>
      </div>
      <div className='end-time'>
        <strong>end: </strong>
        <span data-testid='trainer-home-session-end'>
          {endDate.toDateString()} {endDate.toLocaleTimeString()}
        </span>
      </div>
      {active && <Link to={`/connect/${_id}`}>connect</Link>}
    </div>
  );
};

export default Session;
