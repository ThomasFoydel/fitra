import React, { useState, useContext, useEffect } from 'react';
import './ImageUploader.scss';
import axios from 'axios';
import { CTX } from 'context/Store';
import dots from 'imgs/loading/loading-dots.gif';

import { Keyframes, animated, config } from 'react-spring/renderprops';

const ImageUploader = ({ kind }) => {
  const [appState, updateState] = useContext(CTX);
  const { token, type } = appState.user;
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const Content = Keyframes.Spring(async (next) => {
    while (uploading) {
      await next({
        background: 'rgb(173, 0, 0)',
        from: {
          background: '#ccc',
        },
        config: config.molasses,
      });
      await next({
        background: 'rgb(88, 0, 26)',
        from: {
          background: 'rgb(173, 0, 0)',
        },
        config: config.molasses,
      });
      await next({
        background: '#ccc',
        from: {
          background: 'rgb(88, 0, 26)',
        },
        config: config.molasses,
      });
    }
  });

  const fileHandler = (e) => {
    setFile(e.target.files[0]);
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
      {uploading ? (
        <div className='loading-dots-container'>
          <Content native>
            {(props) => (
              <animated.div
                style={{ position: 'relative', ...props }}
                className='animated-file'
              >
                <img
                  src={dots}
                  className='loading-dots'
                  alt='upload in progress'
                />
              </animated.div>
            )}
          </Content>
        </div>
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
            {file ? <>confirm?</> : <>{`new ${btnTxt} pic`}</>}
          </label>
        </>
      )}
      <div className='err'>{errorMessage}</div>
    </div>
  );
};

export default ImageUploader;
