import axios from 'axios'
import { toast } from 'react-toastify'
import { Navigate, Link, useParams } from 'react-router-dom'
import React, { useState, useEffect, useContext } from 'react'
import IntroMessage from 'Components/IntroMessage/IntroMessage'
import SessionSelector from './SessionSelector'
import Image from 'Components/Image/Image'
import ReviewSlide from './ReviewSlide'
import { CTX } from 'context/Store'
import './TrainerProfile.scss'

const TrainerProfile = () => {
  const { trainerId } = useParams()
  const [{ user, messages }] = useContext(CTX)
  const belongsToCurrentUser = user.id === trainerId
  const [sessionSelectorOpen, setSessionSelectorOpen] = useState(true)
  const [redirectToMessages, setRedirectToMessages] = useState(false)
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [currentTrainer, setCurrentTrainer] = useState(null)
  const [messageOpen, setMessageOpen] = useState(false)
  const [fetchDone, setFetchDone] = useState(false)
  const [selection, setSelection] = useState([])
  const [sessions, setSessions] = useState([])
  const [reviews, setReviews] = useState([])
  const [avg, setAvg] = useState('')

  useEffect(() => {
    let subscribed = true
    if (!trainerId) return
    axios
      .get(`/api/client/trainers/${trainerId}`)
      .then(({ data: { trainer, foundSessions, foundReviews, foundAvg } }) => {
        if (subscribed) {
          setAvg(foundAvg)
          setFetchDone(true)
          setReviews(foundReviews)
          setSessions(foundSessions)
          setCurrentTrainer(trainer)
        }
      })
      .catch(({ response: { data } }) => toast.error(data.message))
    return () => (subscribed = false)
  }, [trainerId])

  const { name, bio, displayEmail, profilePic, coverPic } = currentTrainer || {}

  const toggleMessageOpen = () => {
    if (messages[currentTrainer._id]) setRedirectToMessages(true)
    else {
      setSessionSelectorOpen(false)
      setMessageOpen((o) => !o)
    }
  }

  const toggleSelectorOpen = () => {
    setSessionSelectorOpen((o) => !o)
    setMessageOpen(false)
  }

  if (!fetchDone) return <></>

  return (
    <div className="trainerprofile">
      {bookingSuccess && <Navigate to="/" />}
      {redirectToMessages && (
        <Navigate to={`${user.type === 'trainer' ? 'coachportal' : ''}/messages`} />
      )}

      <div
        className="cover-pic"
        style={{
          backgroundImage: coverPic
            ? ` linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.9)), url("/api/image/${coverPic}")`
            : '',
        }}
      >
        <div className="info">
          <Image name="profile-pic" alt="trainer's profile" src={`/api/image/${profilePic}`} />

          <div className="section-1">
            <div className="name">{name}</div>
            <div className="email">{displayEmail}</div>
            <div className="bio">{bio}</div>

            <div className="avg">Average Rating {Math.floor(avg * 20)} %</div>
            {belongsToCurrentUser && (
              <Link to={`/coachportal/editprofile`} className="link ">
                Edit Profile
              </Link>
            )}
          </div>
        </div>
        <div className="section2">
          <ReviewSlide reviews={reviews} />
        </div>

        {!belongsToCurrentUser && (
          <>
            <div className="btns">
              <button
                onClick={toggleMessageOpen}
                className={`msg-btn ${messageOpen ? 'current' : ''}`}
              >
                <i className="far fa-envelope fa-4x" />
              </button>
              <button
                onClick={toggleSelectorOpen}
                className={`book-btn ${sessionSelectorOpen ? 'current' : ''}`}
              >
                <i className="fa fa-calendar fa-4x" aria-hidden="true" />
              </button>
            </div>
            {messageOpen && <IntroMessage toggle={setMessageOpen} id={trainerId} />}
            {currentTrainer && sessionSelectorOpen && (
              <SessionSelector
                selection={selection}
                bookedTimes={sessions}
                trainer={currentTrainer}
                setSelection={setSelection}
                setBookingSuccess={setBookingSuccess}
                belongsToCurrentUser={belongsToCurrentUser}
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default TrainerProfile
