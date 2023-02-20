import axios from 'axios'
import { toast } from 'react-toastify'
import { act } from '@testing-library/react'
import { Navigate, Link, useParams } from 'react-router-dom'
import React, { useEffect, useState, useContext } from 'react'
import Image from 'Components/Image/Image'
import { CTX } from 'context/Store'
import './ManageSession.scss'

const ManageSession = () => {
  const { id } = useParams()
  const [{ user }] = useContext(CTX)
  const { token } = user
  const [openCancel, setOpenCancel] = useState(false)
  const [deleted, setDeleted] = useState(false)
  const [found, setFound] = useState(null)

  useEffect(() => {
    let subscribed = true
    axios
      .get(`/api/trainer/session/${id}`, { headers: { 'x-auth-token': token } })
      .then(({ data: { foundSession, foundClient } }) => {
        if (subscribed) act(() => setFound({ session: foundSession, client: foundClient }))
      })
    return () => (subscribed = false)
  }, [token, id])

  const handleCancel = () => {
    axios
      .delete(`/api/trainer/cancel-session/`, { headers: { 'x-auth-token': token, id } })
      .then(() => setDeleted(true))
      .catch(({ response: { data } }) => toast.error(data.message))
  }

  const { startTime, endTime, _id, client } = found ? found.session : {}
  const { name } = found?.client || {}
  const start = new Date(startTime)
  const end = new Date(endTime)
  const currentTime = new Date(Date.now())
  const started = currentTime > start
  const ended = currentTime > end
  const active = started && !ended

  return (
    <div className="manage-session">
      {deleted && <Navigate to="/coachportal/schedule" />}
      {found && (
        <>
          <Link to="/coachportal/schedule">
            <i className="fas fa-angle-left fa-4x back-link" />
          </Link>
          <Link to={`/user/${client}`}>
            <Image
              name="profile-pic"
              alt="client's profile"
              src={`/api/image/user/profilePic/${client}`}
            />
          </Link>
          <Link to={`/user/${client}`}>
            <div className="name">{name}</div>
          </Link>
          <div className="date">{start && start.toLocaleDateString()}</div>
          <div className="start">start: {start && start.toLocaleTimeString()}</div>
          <div className="end">end: {end && end.toLocaleTimeString()}</div>
          {active && (
            <Link className="connect-link" to={`/connect/${_id}`}>
              connect
            </Link>
          )}

          {openCancel ? (
            <div className="cancel">
              <p>cancel this session?</p>
              <button className="close-btn" onClick={() => setOpenCancel(false)}>
                nevermind
              </button>
              <button className="confirm-btn" onClick={handleCancel}>
                confirm
              </button>
            </div>
          ) : (
            <button className="cancel-btn" onClick={() => setOpenCancel(true)}>
              cancel session
            </button>
          )}
        </>
      )}
    </div>
  )
}

export default ManageSession
