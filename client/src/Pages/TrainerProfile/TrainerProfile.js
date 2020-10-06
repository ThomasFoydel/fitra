import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TrainerProfile.scss';
import AppointmentSelector from './AppointmentSelector';

const TrainerProfile = ({ match }) => {
  const [currentTrainer, setCurrentTrainer] = useState({});
  const [startTime, setStartTime] = useState('AUG 25 2020 4:00PM');
  const [endTime, setEndTime] = useState('AUG 25 2020 5:00PM');
  const [day, setDay] = useState();
  const [errMsg, setErrMsg] = useState('');
  useEffect(() => {
    let subscribed = true;
    const { trainerId } = match.params;
    axios
      .get(`/api/client/trainer/${trainerId}`)
      .then(({ data }) => {
        let { trainer, err } = data;
        if (subscribed) setCurrentTrainer(trainer);
      })
      .catch((err) => console.log('trainer profile error: ', err));
    return () => (subscribed = false);
  }, []);

  const bookAppointment = () => {
    // open paypal, upon completion of payment axios post request to server
    // in backend, create new appointment in db
    let token = localStorage.getItem('fitr-token');
    let start = startTime + ':00';
    let end = endTime + ':00';
    const startDate = new Date(day + 'T' + start);
    const startUTC = startDate.toISOString();
    const endDate = new Date(day + 'T' + end);
    const endUTC = endDate.toISOString();
    console.log(' { startTime: startUTC, endTime: endUTC,: ', {
      startTime: startUTC,
      endTime: endUTC,
    });
    axios
      .post(
        '/api/appointment/new',
        { startTime: startUTC, endTime: endUTC, trainer: currentTrainer._id },
        {
          headers: { 'x-auth-token': token },
        }
      )
      .then((result) => {
        console.log('booking result: ', result);
      });

    // let offset = new Date().getTimezoneOffset();
  };
  // console.log('thing: ', Intl.DateTimeFormat().resolvedOptions().timeZone);
  console.log('currentTrainer: ', currentTrainer);
  // trainer bio info week / display of availability
  // selecting time should update state value representing their selection
  // and open modal asking to confirm that it is the time they want
  let { name, bio, email, profilePic, coverPic } = currentTrainer;
  return (
    <div className='trainerprofile'>
      <div
        className='cover-pic'
        style={{
          backgroundImage: coverPic
            ? ` linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.9)), url("/api/image/${coverPic}")`
            : '',
        }}
      >
        <div className='name'>{name}</div>
        <div className='bio'>{bio}</div>
        <div className='email'>{email}</div>
        <img className='profile-pic' src={`/api/image/${profilePic}`} />

        <input
          type='time'
          onChange={(e) => setStartTime(e.target.value)}
          id='startTime'
          value={startTime}
        />
        <input
          type='time'
          onChange={(e) => setEndTime(e.target.value)}
          id='endTime'
          value={endTime}
        />
        <input type='date' onChange={(e) => setDay(e.target.value)}></input>
        <button onClick={bookAppointment}>book session</button>
        <AppointmentSelector entries={currentTrainer.availability} />
      </div>
    </div>
  );
};

export default TrainerProfile;
