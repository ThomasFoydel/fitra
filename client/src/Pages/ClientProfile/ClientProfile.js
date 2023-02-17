import axios from 'axios'
import { Link, useParams } from 'react-router-dom'
import React, { useState, useEffect, useContext, useRef } from 'react'
import Image from 'Components/Image/Image'
import loadingSpin from 'imgs/loading/spin.gif'
import { CTX } from 'context/Store'
import './ClientProfile.scss'

const ClientProfile = () => {
  const { id } = useParams()
  const [{ user }] = useContext(CTX)
  const { token } = user
  const belongsToCurrentUser = user.id === id
  const [userData, setUserData] = useState(null)
  const [err, setErr] = useState('')

  useEffect(() => {
    let subscribed = true
    axios
      .get(`/api/client/profile/${id}`, { headers: { 'x-auth-token': token } })
      .then(({ data: { foundUser, err } }) => {
        if (err && subscribed) setErr(err)
        else if (foundUser && subscribed) setUserData(foundUser)
      })
    return () => (subscribed = false)
  }, [id, token])

  const didMountRef = useRef(false)
  useEffect(() => {
    let subscribed = true
    if (didMountRef.current) {
      setTimeout(() => {
        if (subscribed) setErr('')
      }, 2700)
    } else didMountRef.current = true
    return () => (subscribed = false)
  }, [err])

  const { coverPic, profilePic, bio, name, displayEmail } = userData || {}

  return (
    <div className="clientprofile">
      {userData && (
        <>
          <div
            className="cover-pic"
            style={{
              backgroundImage: coverPic
                ? ` linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.9)), url("/api/image/${coverPic}")`
                : '',
            }}
          >
            <div className="info">
              <Image
                src={profilePic ? `/api/image/${profilePic}` : loadingSpin}
                alt={profilePic ? "user's profile" : 'loading profile'}
                name="profile-pic"
              />
              <div className="section-1">
                <div className="name">{name}</div>
                <div className="email">{displayEmail}</div>
                {bio && <div className="bio">{bio}</div>}
                {belongsToCurrentUser && (
                  <Link to={`/editprofile`} className="link">
                    Edit Profile
                  </Link>
                )}
              </div>
            </div>
          </div>
          <div className="err">{err}</div>
        </>
      )}
    </div>
  )
}

export default ClientProfile
