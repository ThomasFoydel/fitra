import React, { useState, useContext } from 'react';
import './Delete.scss';
import { CTX } from 'context/Store';
import axios from 'axios';

const Delete = () => {
  const [appState, updateState] = useContext(CTX);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [secondConfirm, setSecondConfirm] = useState(false);
  const {
    user: { id },
  } = appState;

  const handleDelete = () => {
    axios
      .post('/api/delete_my_account')
      .then((res) => {
        console.log({ res });
      })
      .catch((err) => console.log({ err }));
  };
  return (
    <div className='delete-page'>
      <h2>delete my account</h2>

      {secondConfirm ? (
        <div>
          <h3>Okay, this is it. Remember, it's permanent.</h3>
          <button onClick={handleDelete}>DELETE</button>
          <button
            onClick={() => {
              setOpenConfirm(false);
              setSecondConfirm(false);
            }}
          >
            nevermind
          </button>
        </div>
      ) : openConfirm ? (
        <div>
          <h3>You sure? This cannot be undone.</h3>
          <button onClick={() => setSecondConfirm(true)}>Yes</button>
          <button onClick={() => setOpenConfirm(false)}>No</button>
        </div>
      ) : (
        <button onClick={() => setOpenConfirm(true)}>delete my account</button>
      )}
    </div>
  );
};

export default Delete;
