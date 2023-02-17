import React from 'react'
import { Link } from 'react-router-dom'
import Image from 'Components/Image/Image'

const Session = ({ session: { startTime, endTime, _id, trainer, status } }) => {
  const endDate = new Date(endTime)
  const startDate = new Date(startTime)
  const currentTime = new Date(Date.now())
  const started = currentTime > startDate
  const ended = currentTime > endDate
  const active = started && !ended

  return (
    <div
      className={`session 
      ${ended && ' ended '}
      ${active && ' active '} 
      ${!started && ' not-started '} 
      `}
    >
      <Link to={`/trainer/${trainer}`}>
        <Image
          name="profile-pic"
          src={`/api/image/user/profilePic/${trainer}`}
          alt="trainer's profile"
        />
      </Link>
      <div className="start-time">
        <strong>start: </strong>
        <span data-testid="client-home-session-start">
          {startDate.toDateString()} {startDate.toLocaleTimeString()}
        </span>
      </div>
      <div className="end-time">
        <strong>end: </strong>
        <span data-testid="client-home-session-end">
          {endDate.toDateString()} {endDate.toLocaleTimeString()}
        </span>
      </div>
      {active && <Link to={`/connect/${_id}`}>connect</Link>}
      {ended && status !== 'reviewed' && <Link to={`/review/${_id}`}>review</Link>}
    </div>
  )
}

export default Session
