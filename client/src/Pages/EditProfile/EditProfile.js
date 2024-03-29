import axios from 'axios'
import { toast } from 'react-toastify'
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

  const handleSubmit = (e) => {
    e.preventDefault()
    axios
      .put(`/api/${type}/profiles`, formInfo, { headers: { 'x-auth-token': token } })
      .then(({ data: { updatedProfile } }) => {
        const { bio, coverPic, displayEmail, name, profilePic } = updatedProfile
        const filteredRes = { bio, coverPic, displayEmail, name, profilePic }
        act(() => {
          updateState({ type: 'EDIT_PROFILE', payload: { res: filteredRes } })
          toast.success('Updated profile')
          setFormInfo(initFormData)
        })
      })
      .catch(({ response: { data } }) => toast.error(data.message))
  }

  return (
    <form className="edit-profile" onSubmit={handleSubmit}>
      <h2>EDIT YOUR PROFILE</h2>
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
      <button className="submit-btn" type="submit">
        submit
      </button>
      <div className="image-uploaders">
        <div className="uploader">
          <Image name="edit-pic" alt="your profile" src={`/api/image/${profilePic}`} />
          <ImageUploader props={{ kind: 'profilePic' }} />
        </div>
        <div className="uploader">
          <Image name="edit-pic" alt="your cover" src={`/api/image/${coverPic}`} />
          <ImageUploader props={{ kind: 'coverPic' }} />
        </div>
      </div>
    </form>
  )
}

export default EditProfile
