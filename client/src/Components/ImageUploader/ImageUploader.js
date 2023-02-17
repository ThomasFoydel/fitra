import axios from 'axios'
import PropTypes from 'prop-types'
import React, { useState, useContext, useEffect } from 'react'
import { Keyframes, animated, config } from 'react-spring'
import dots from 'imgs/loading/loading-dots.gif'
import { CTX } from 'context/Store'
import './ImageUploader.scss'

const ImageUploader = ({ props: { kind } }) => {
  const [{ user }, updateState] = useContext(CTX)
  const { token, type } = user
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const Content = Keyframes.Spring(async (next) => {
    while (uploading) {
      await next({
        background: 'rgb(173, 0, 0)',
        from: { background: '#ccc' },
        config: config.molasses,
      })
      await next({
        background: 'rgb(88, 0, 26)',
        from: { background: 'rgb(173, 0, 0)' },
        config: config.molasses,
      })
      await next({
        background: '#ccc',
        from: { background: 'rgb(88, 0, 26)' },
        config: config.molasses,
      })
    }
  })

  const fileHandler = (e) => setFile(e.target.files[0])

  const handleSubmit = () => {
    if (!file) return
    if (file.size > 1000000) return setErrorMessage('File size cannot exceed 1mb')
    setUploading(true)
    const fd = new FormData()
    fd.append('image', file, file.name)
    axios
      .post(`/api/image/upload/${type}/${kind}`, fd, { headers: { 'x-auth-token': token } })
      .then(({ data }) => {
        if (data.err) return setErrorMessage(data.err)
        const { coverPic, profilePic } = data.user
        setFile(null)
        setUploading(false)
        updateState({ type: 'CHANGE_PIC', payload: { kind, coverPic, profilePic } })
      })
      .catch((err) => {
        setUploading(false)
        console.error('err: ', err)
      })
  }

  useEffect(() => {
    let subscribed = true
    if (errorMessage) setTimeout(() => subscribed && setErrorMessage(''), 3000)
    return () => (subscribed = false)
  }, [errorMessage])

  const btnTxt = kind === 'profilePic' ? 'profile' : 'cover'

  return (
    <div className="image-uploader">
      {uploading ? (
        <div className="loading-dots-container">
          <Content native>
            {(props) => (
              <animated.div style={{ position: 'relative', ...props }} className="animated-file">
                <img src={dots} className="loading-dots" alt="upload in progress" />
              </animated.div>
            )}
          </Content>
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
            onClick={handleSubmit}
            htmlFor={`${kind}-file`}
            className={`file-label ${file && ' file-exists '}`}
          >
            {file ? <>confirm?</> : <>{`new ${btnTxt} pic`}</>}
          </label>
        </>
      )}
      <div className="err">{errorMessage}</div>
    </div>
  )
}

export default ImageUploader

ImageUploader.propTypes = {
  props: PropTypes.shape({
    kind: PropTypes.string.isRequired,
  }),
}
