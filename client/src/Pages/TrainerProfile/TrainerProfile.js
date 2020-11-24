import React, { useState, useEffect, useContext } from 'react';
import { Redirect, Link } from 'react-router-dom';
import axios from 'axios';
import IntroMessage from 'Components/IntroMessage/IntroMessage';

import AppointmentSelector from './AppointmentSelector';
import Image from 'Components/Image/Image';

import { CTX } from 'context/Store';
import './TrainerProfile.scss';

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
  const [messageOpen, setMessageOpen] = useState(false);
  const [selection, setSelection] = useState([]);
  const [redirectToMessages, setRedirectToMessages] = useState(false);

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

  const toggleMessageOpen = () => {
    if (appState.messages[currentTrainer._id]) {
      setRedirectToMessages(true);
    } else {
      setApptSelectorOpen(false);
      setMessageOpen((o) => !o);
    }
  };

  const toggleSelectorOpen = () => {
    setMessageOpen(false);
    setApptSelectorOpen((o) => !o);
  };

  return (
    <div className='trainerprofile'>
      {bookingSuccess && <Redirect to='/' />}
      {redirectToMessages && (
        <Redirect
          to={`${
            appState.user.type === 'trainer' ? 'coachportal' : ''
          }/messages`}
        />
      )}
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
            <div className='info'>
              <Image src={`/api/image/${profilePic}`} name='profile-pic' />
              <div className='name'>{name}</div>
              <div className='email'>{email}</div>
              {belongsToCurrentUser && (
                <Link to={`/coachportal/editprofile`} className='link'>
                  Edit Profile
                </Link>
              )}
              <div className='bio'>{bio}</div>
            </div>
          </div>
          <div className='section2'>
            {/* <div className='bio'>{bio}</div> */}
          </div>

          {!belongsToCurrentUser && (
            <>
              <div className='btns'>
                <button
                  className={`msg-btn ${messageOpen ? 'current' : ''}`}
                  onClick={toggleMessageOpen}
                >
                  <i className='far fa-envelope fa-4x'></i>
                </button>
                <button
                  className={`book-btn ${apptSelectorOpen ? 'current' : ''}`}
                  onClick={toggleSelectorOpen}
                >
                  <i className='fa fa-calendar fa-4x' aria-hidden='true'></i>
                </button>
              </div>
              {messageOpen && (
                <IntroMessage toggle={setMessageOpen} id={trainerId} />
              )}
              {apptSelectorOpen && (
                <AppointmentSelector
                  belongsToCurrentUser={belongsToCurrentUser}
                  bookedTimes={appointments}
                  trainer={currentTrainer}
                  setBookingSuccess={setBookingSuccess}
                  selection={selection}
                  setSelection={setSelection}
                />
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
