import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { CTX } from 'context/Store';
import './SessionReview.scss';
const SessionReview = ({
  match: {
    params: { sessionId },
  },
}) => {
  const [appState, updateState] = useContext(CTX);

  const [formData, setFormData] = useState({ rating: 2, comment: '' });
  let { rating, comment } = formData;
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    axios.get('/api/session/');
  }, []);

  const handleChange = ({ target: { value, id } }) =>
    setFormData((form) => {
      return { ...form, [id]: value };
    });

  const submit = () => {
    axios
      .post(`/api/client/review/${sessionId}`, formData, {
        headers: { 'x-auth-token': appState.user.token },
      })
      .then(({ data, err }) => {
        if (err) return setErr(err);
      })
      .catch((err) => console.log({ err }));
  };
  return (
    <div className='session-review'>
      <h2>Session Review</h2>
      <select onChange={handleChange} value={rating} id='rating'>
        <option value={4}>perfect</option>
        <option value={3}>great</option>
        <option value={2}>good</option>
        <option value={1}>ok</option>
        <option value={0}>bad</option>
      </select>
      <textarea
        onChange={handleChange}
        value={comment}
        id='comment'
        cols='30'
        rows='10'
      ></textarea>
      {confirmOpen ? (
        <>
          <button onClick={submit}>confirm</button>
          <button onClick={() => setConfirmOpen(false)}>cancel</button>
        </>
      ) : (
        <button onClick={() => setConfirmOpen(true)}>submit</button>
      )}
    </div>
  );
};

export default SessionReview;
