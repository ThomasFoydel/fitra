import React, { useState, useContext } from 'react';
import './Delete.scss';
import { CTX } from 'context/Store';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Delete = () => {
  const [appState, updateState] = useContext(CTX);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [secondConfirm, setSecondConfirm] = useState(false);
  const [inputVal, setInputVal] = useState('');

  const {
    user: { id, type, token },
  } = appState;
  const isTrainer = type === 'trainer';

  const handleDelete = () => {
    axios
      .post(
        '/api/delete_my_account',
        { id, password: inputVal },
        { headers: { 'x-auth-token': token } }
      )
      .then((res) => {
        console.log({ res });
      })
      .catch((err) => console.log({ err }));
  };

  const handleInput = ({ target: { value } }) => setInputVal(value);

  return (
    <>
      <div className='background' />
      <div className='overlay' />
      <div className='delete-page'>
        <h2>delete my account</h2>

        {secondConfirm ? (
          <div className='flexcol'>
            {/* <h3>Okay, this is it. Remember, it's permanent.</h3> */}
            <input
              type='password'
              onChange={handleInput}
              value={inputVal}
              placeholder='password'
            />
            <div className='btns'>
              <button
                onClick={() => {
                  setOpenConfirm(false);
                  setSecondConfirm(false);
                }}
                className='cancel-btn'
              >
                nevermind
              </button>
              <button onClick={handleDelete} className='delete-btn'>
                DELETE
              </button>
            </div>
          </div>
        ) : openConfirm ? (
          <div className='flexcol'>
            <h3>You sure? This cannot be undone.</h3>
            <div className='btns'>
              <button
                onClick={() => setOpenConfirm(false)}
                className='cancel-btn'
              >
                No
              </button>
              <button
                onClick={() => setSecondConfirm(true)}
                className='delete-btn'
              >
                Yes
              </button>
            </div>
          </div>
        ) : (
          <>
            <h3>WARNING! THIS IS PERMANENT!</h3>

            <button onClick={() => setOpenConfirm(true)} className='delete-btn'>
              delete my account
            </button>
          </>
        )}
        <Link
          className='close-btn'
          to={`${isTrainer ? '/coachportal' : ''}/settings`}
        >
          <i className='fas fa-times fa-3x'></i>
        </Link>
      </div>
    </>
  );
};

export default Delete;
