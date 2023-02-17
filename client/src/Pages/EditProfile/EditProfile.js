import axios from 'axios'
import { Link } from 'react-router-dom'
import { act } from '@testing-library/react'
import React, { useState, useContext } from 'react'
import ImageUploader from 'Components/ImageUploader/ImageUploader'
import Image from 'Components/Image/Image'
import { CTX } from 'context/Store'
import './EditProfile.scss'

const initFormData = { name: '', bio: '', displayEmail: '' }

const EditProfile = () => {
  const [{ user }, updateState] = useContext(CTX)
  const { token, coverPic, profilePic, name, bio, displayEmail, id, type } = user

  const [formInfo, setFormInfo] = useState({
    bio: bio || '',
    name: name || '',
    displayEmail: displayEmail || '',
  })

  const handleChange = ({ target: { id, value } }) => setFormInfo({ ...formInfo, [id]: value })

  const handleSubmit = () => {
    axios
      .put(`/api/${type}/editprofile`, formInfo, { headers: { 'x-auth-token': token } })
      .then(({ data: { bio, coverPic, displayEmail, name, profilePic } }) => {
        const filteredRes = { bio, coverPic, displayEmail, name, profilePic }
        if (process.env.NODE_ENV === 'production') {
          updateState({ type: 'EDIT_PROFILE', payload: { res: filteredRes } })
          setFormInfo(initFormData)
        } else {
          act(() => {
            updateState({ type: 'EDIT_PROFILE', payload: { res: filteredRes } })
            setFormInfo(initFormData)
          })
        }
      })
      .catch((err) => console.error('err: ', err))
  }
  return (
    <>
      <div className="background" />
      <div className="edit-profile">
        <h2>Edit your profile</h2>
        <Link className="link" to={`${type === 'trainer' ? '/trainer' : '/user'}/${id}`}>
          back to my profile
        </Link>
        <input
          id="name"
          type="text"
          value={formInfo.name}
          onChange={handleChange}
          placeholder={name || 'name...'}
        />
        <input
          id="bio"
          type="text"
          value={formInfo.bio}
          onChange={handleChange}
          placeholder={bio || 'bio...'}
        />
        <input
          id="displayEmail"
          type="displayEmail"
          onChange={handleChange}
          value={formInfo.displayEmail}
          placeholder={displayEmail || 'display email...'}
        />
        <button className="submit-btn" onClick={handleSubmit}>
          submit
        </button>
        <div className="image-uploaders">
          <div className="uploader">
            <Image
              name="edit-pic"
              src={`/api/image/${profilePic || '5f4d8786efa2ae10b38bfe9e'}`}
              alt="your profile"
            />
            <ImageUploader props={{ kind: 'profilePic' }} />
          </div>
          <div className="uploader">
            <Image
              name="edit-pic"
              alt="your cover"
              src={`/api/image/${coverPic || '5f4d8786efa2ae10b38bfe9e'}`}
            />
            <ImageUploader props={{ kind: 'coverPic' }} />
          </div>
        </div>
      </div>
    </>
  )
}

export default EditProfile
