import React, { useState, useEffect, useContext } from 'react';
import { Redirect, Link } from 'react-router-dom';
import axios from 'axios';

import AppointmentSelector from './AppointmentSelector';
import './TrainerProfile.scss';
import { CTX } from 'context/Store';
import Image from 'Components/Image/Image';

//todo: if no trainer found, redirect

const TrainerProfile = ({
  match: {
    params: { trainerId },
  },
}) => {
  const [appState, updateState] = useContext(CTX);
  let belongsToCurrentUser = appState.user.id === trainerId;

  const [currentTrainer, setCurrentTrainer] = useState({});
  const [appointments, setAppointments] = useState([]);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [apptSelectorOpen, setApptSelectorOpen] = useState(false);
  const [firstRender, setFirstRender] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    let subscribed = true;
    axios
      .get(`/api/client/trainer/${trainerId}`)
      .then(({ data: { trainer, err, foundAppointments } }) => {
        if (err && subscribed) setErr(err);
        else if (subscribed) {
          setCurrentTrainer(trainer);
          setAppointments(foundAppointments);
        }
      })
      .catch((err) => console.log('trainer profile error: ', err));
    return () => (subscribed = false);
  }, []);

  let { name, bio, email, profilePic, coverPic } = currentTrainer;

  return (
    <div className='trainerprofile'>
      {bookingSuccess && <Redirect to='/schedule' />}
      {err ? (
        <p>{err}</p>
      ) : (
        <div
          className='cover-pic'
          style={{
            backgroundImage: coverPic
              ? ` linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.9)), url("/api/image/${coverPic}")`
              : '',
          }}
        >
          <div className='section1'>
            {/* <img className='profile-pic' src={`/api/image/${profilePic}`} /> */}

            <Image src={`/api/image/${profilePic}`} name='profile-pic' />
            <div className='info'>
              <div className='name'>{name}</div>
              <div className='email'>{email}</div>
              {belongsToCurrentUser && (
                <Link to={`/coachportal/editprofile`} className='link'>
                  Edit Profile
                </Link>
              )}
            </div>
          </div>
          <div className='section2'>
            <div className='bio'>{bio}</div>
          </div>

          {!belongsToCurrentUser && (
            <>
              <button>message</button>

              {apptSelectorOpen ? (
                <AppointmentSelector
                  belongsToCurrentUser={belongsToCurrentUser}
                  bookedTimes={appointments}
                  trainer={currentTrainer}
                  setBookingSuccess={setBookingSuccess}
                />
              ) : (
                <button
                  className='apptselector-open'
                  onClick={() => setApptSelectorOpen(true)}
                >
                  book session
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default TrainerProfile;

/*
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


// const bookAppointment = () => {
  //   // open paypal, upon completion of payment axios post request to server
  //   // in backend, create new appointment in db
  //   let token = localStorage.getItem('fitr-token');
  //   let start = startTime + ':00';
  //   let end = endTime + ':00';
  //   const startDate = new Date(day + 'T' + start);
  //   const startUTC = startDate.toISOString();
  //   const endDate = new Date(day + 'T' + end);
  //   const endUTC = endDate.toISOString();
  //   console.log(' { startTime: startUTC, endTime: endUTC,: ', {
  //     startTime: startUTC,
  //     endTime: endUTC,
  //   });
  //   axios
  //     .post(
  //       '/api/appointment/new',
  //       { startTime: startUTC, endTime: endUTC, trainer: currentTrainer._id },
  //       {
  //         headers: { 'x-auth-token': token },
  //       }
  //     )
  //     .then((result) => {
  //       console.log('booking result: ', result);
  //     });

  //   // let offset = new Date().getTimezoneOffset();
  // };
  // console.log('thing: ', Intl.DateTimeFormat().resolvedOptions().timeZone);
  // console.log('currentTrainer: ', currentTrainer);

*/
