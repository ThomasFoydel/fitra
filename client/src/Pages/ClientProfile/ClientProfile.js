import axios from 'axios'
import { Link, useParams } from 'react-router-dom'
import React, { useState, useEffect, useContext } from 'react'
import defaultProfile from 'imgs/default/profile.jpg'
import loadingSpin from 'imgs/loading/spin.gif'
import Image from 'Components/Image/Image'
import { toast } from 'react-toastify'
import { CTX } from 'context/Store'
import './ClientProfile.scss'

const ClientProfile = () => {
  const { id } = useParams()
  const [{ user }] = useContext(CTX)
  const { token } = user
  const belongsToCurrentUser = user.id === id
  const [userData, setUserData] = useState(null)

  useEffect(() => {
    let subscribed = true
    axios
      .get(`/api/client/profiles/${id}`, { headers: { 'x-auth-token': token } })
      .then(({ data: { foundUser } }) => foundUser && subscribed && setUserData(foundUser))
      .catch(({ response: { data } }) => toast.error(data.message))
    return () => (subscribed = false)
  }, [id, token])

  const { coverPic, profilePic, bio, name, displayEmail } = userData || {}

  return (
    <div className="clientprofile">
      {userData && (
        <div
          className="cover-pic"
          style={{
            backgroundImage: coverPic
              ? ` linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.9)), url("/api/image/${coverPic}")`
              : '',
          }}
        >
          <div className="info">
            <Image name="profile-pic" alt="user's profile" src={`/api/image/${profilePic}`} />
            <div className="section-1">
              <div className="name">{name}</div>
              <div className="email">{displayEmail}</div>
              {bio && <div className="bio">{bio}</div>}
              {belongsToCurrentUser && (
                <Link to={`/editprofile`} className="edit-link">
                  Edit Profile
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ClientProfile
