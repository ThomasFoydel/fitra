import React, { useState, useContext, useEffect } from 'react';
import './ImageUploader.scss';
import axios from 'axios';
import { CTX } from 'context/Store';
const ImageUploader = ({ kind }) => {
  const [appState, updateState] = useContext(CTX);
  const { token, type } = appState.user;
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const fileHandler = (e) => {
    setFile(e.target.files[0]);
    // setProfileInputContainsFile(true);
  };
  const handleSubmit = () => {
    if (file) {
      if (file.size > 1000000)
        return setErrorMessage('File size cannot exceed 1mb');
      setUploading(true);
      const fd = new FormData();
      fd.append('image', file, file.name);
      axios
        .post(`/api/image/upload/${type}/${kind}`, fd, {
          headers: { 'x-auth-token': token },
        })
        .then(({ data }) => {
          if (data.err) return setErrorMessage(data.err);
          let { coverPic, profilePic } = data.user;
          updateState({
            type: 'CHANGE_PIC',
            payload: { kind, coverPic, profilePic },
          });
          setUploading(false);
          setFile(null);
        })
        .catch((err) => {
          setUploading(false);
          console.log('err: ', err);
        });
    }
  };

  useEffect(() => {
    let subscribed = true;
    if (errorMessage) {
      setTimeout(() => {
        if (subscribed) {
          setErrorMessage('');
        }
      }, 3000);
    }
    return () => (subscribed = false);
  }, [errorMessage]);

  const btnTxt = kind === 'profilePic' ? 'profile' : 'cover';
  return (
    <div className='image-uploader'>
      {/* <div className='kind'>{kind}</div> */}

      {uploading ? (
        <img
          src={`https://i.pinimg.com/originals/3b/4e/10/3b4e109d6b621ed5a9249769afbd4dfa.gif`}
          className='image-uploader-loading'
          alt='upload in progress'
        />
      ) : (
        <>
          <input
            className='file'
            onChange={fileHandler}
            type='file'
            name={`${kind}-file`}
            id={`${kind}-file`}
          />
          <label
            className={`file-label ${file && ' file-exists '}`}
            htmlFor={`${kind}-file`}
            onClick={handleSubmit}
          >
            {file ? <>confirm</> : <>{`new ${btnTxt} pic`}</>}
          </label>
        </>
      )}
      <div className='err'>{errorMessage}</div>
    </div>
  );
};

export default ImageUploader;
