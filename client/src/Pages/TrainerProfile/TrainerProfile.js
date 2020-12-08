import React, { useState, useEffect, useContext } from 'react';
import { Redirect, Link } from 'react-router-dom';
import axios from 'axios';
import IntroMessage from 'Components/IntroMessage/IntroMessage';
import stars from 'imgs/icons/stars.png';
import SessionSelector from './SessionSelector';
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
  const [sessions, setSessions] = useState([]);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [sessionSelectorOpen, setSessionSelectorOpen] = useState(false);
  const [messageOpen, setMessageOpen] = useState(false);
  const [selection, setSelection] = useState([]);
  const [redirectToMessages, setRedirectToMessages] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [avg, setAvg] = useState('');

  const [err, setErr] = useState('');

  useEffect(() => {
    let subscribed = true;
    axios
      .get(`/api/client/trainer/${trainerId}`)
      .then(
        ({ data: { trainer, err, foundSessions, foundReviews, foundAvg } }) => {
          console.log({ foundSessions });
          if (err && subscribed) setErr(err);
          else if (subscribed) {
            setCurrentTrainer(trainer);
            setSessions(foundSessions);
            setReviews(foundReviews);
            setAvg(foundAvg);
          }
        }
      )
      .catch((err) => console.log('trainer profile error: ', err));
    return () => (subscribed = false);
  }, []);

  let { name, bio, email, profilePic, coverPic } = currentTrainer;

  const toggleMessageOpen = () => {
    if (appState.messages[currentTrainer._id]) {
      setRedirectToMessages(true);
    } else {
      setSessionSelectorOpen(false);
      setMessageOpen((o) => !o);
    }
  };

  const toggleSelectorOpen = () => {
    setMessageOpen(false);
    setSessionSelectorOpen((o) => !o);
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
          <div className='info'>
            <Image src={`/api/image/${profilePic}`} name='profile-pic' />
            <div className='section-1'>
              <div className='name'>{name}</div>
              <div className='email'>{email}</div>
              <div className='bio'>{bio}</div>

              <div className='avg'>Average Rating {Math.floor(avg * 20)} %</div>
              {belongsToCurrentUser && (
                <Link to={`/coachportal/editprofile`} className='link '>
                  Edit Profile
                </Link>
              )}
            </div>
          </div>
          <div className='section2'>
            {/* <div className='bio'>{bio}</div> */}
            <div className='reviews'>
              {reviews.map((review) => (
                <Review review={review} key={review._id} />
              ))}
            </div>
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
                  className={`book-btn ${sessionSelectorOpen ? 'current' : ''}`}
                  onClick={toggleSelectorOpen}
                >
                  <i className='fa fa-calendar fa-4x' aria-hidden='true'></i>
                </button>
              </div>
              {messageOpen && (
                <IntroMessage toggle={setMessageOpen} id={trainerId} />
              )}
              {sessionSelectorOpen && (
                <SessionSelector
                  belongsToCurrentUser={belongsToCurrentUser}
                  bookedTimes={sessions}
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

const Review = ({ review: { rating, comment, client } }) => {
  return (
    <div className='review'>
      {/* <img src="" className="client" alt="client profile"/> */}
      <Image
        src={`/api/image/user/profilePic/${client}`}
        name='review-profile-pic'
      />
      <div className='star-rating'>
        <div
          className='rating-background'
          style={{
            width: `${Math.floor(rating * 20)}%`,
            background: `linear-gradient(
            to right, rgb(245, 220, 0), rgb(255, ${Math.floor(
              255 - rating * 51
            )}, 0)
          )`,
          }}
        ></div>
        <img className='stars' src={stars} alt='star rating' />
      </div>
      <div className='rating'>{rating}</div>
      <div className='comment'>{comment}</div>
    </div>
  );
};

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
        <button onClick={bookSession}>book session</button>


// const bookSession = () => {
  //   // open paypal, upon completion of payment axios post request to server
  //   // in backend, create new session in db
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
  //       '/api/session/new',
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
