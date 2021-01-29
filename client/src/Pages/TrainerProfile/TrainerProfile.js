import React, { useState, useEffect, useContext } from 'react';
import { Redirect, Link } from 'react-router-dom';
import axios from 'axios';
import IntroMessage from 'Components/IntroMessage/IntroMessage';

import SessionSelector from './SessionSelector';
import Image from 'Components/Image/Image';
import ReviewSlide from './ReviewSlide';

import { CTX } from 'context/Store';
import './TrainerProfile.scss';

import loadingSpin from 'imgs/loading/spin.gif';

const TrainerProfile = ({
  match: {
    params: { trainerId },
  },
}) => {
  const [appState] = useContext(CTX);
  let belongsToCurrentUser = appState.user.id === trainerId;

  const [currentTrainer, setCurrentTrainer] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [sessionSelectorOpen, setSessionSelectorOpen] = useState(true);
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
  }, [trainerId]);

  let { name, bio, displayEmail, profilePic, coverPic } = currentTrainer || {};
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
            <Image
              src={profilePic ? `/api/image/${profilePic}` : loadingSpin}
              name='profile-pic'
              alt="trainer's profile"
            />

            <div className='section-1'>
              <div className='name'>{name}</div>
              <div className='email'>{displayEmail}</div>
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
            <ReviewSlide reviews={reviews} />
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
              {currentTrainer && sessionSelectorOpen && (
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
