import axios from 'axios'
import PropTypes from 'prop-types'
import { toast } from 'react-toastify'
import React, { useState, useContext } from 'react'
import dots from 'imgs/loading/loading-dots.gif'
import { CTX } from 'context/Store'
import './ImageUploader.scss'

const ImageUploader = ({ props: { kind } }) => {
  const [{ user }, updateState] = useContext(CTX)
  const { token, type } = user
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)

  const fileHandler = (e) => setFile(e.target.files[0])

  const handleSubmit = () => {
    if (file.size > 1000000) return toast.error('File size cannot exceed 1MB')
    setUploading(true)
    const fd = new FormData()
    fd.append('image', file, file.name)
    axios
      .post(`/api/image/upload/${type}/${kind}`, fd, { headers: { 'x-auth-token': token } })
      .then(({ data: { user } }) => {
        const { coverPic, profilePic } = user
        setFile(null)
        setUploading(false)
        updateState({ type: 'CHANGE_PIC', payload: { kind, coverPic, profilePic } })
      })
      .catch(({ response: { data } }) => {
        setUploading(false)
        toast.error(data.message)
      })
  }

  const btnTxt = kind === 'profilePic' ? 'profile' : 'cover'

  return (
    <div className="image-uploader">
      {uploading ? (
        <div className="loading-dots-container">
          <img src={dots} className="loading-dots" alt="upload in progress" />
        </div>
      ) : (
        <>
          <input
            type="file"
            className="file"
            id={`${kind}-file`}
            name={`${kind}-file`}
            onChange={fileHandler}
          />
          <label
            htmlFor={`${kind}-file`}
            onClick={file ? handleSubmit : () => {}}
            className={`file-label ${file && ' file-exists '}`}
          >
            {file ? <>confirm?</> : <>{`new ${btnTxt} pic`}</>}
          </label>
        </>
      )}
    </div>
  )
}

export default ImageUploader

ImageUploader.propTypes = {
  props: PropTypes.shape({
    kind: PropTypes.string.isRequired,
  }),
}
