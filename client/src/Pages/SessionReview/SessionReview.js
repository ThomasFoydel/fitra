import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { CTX } from 'context/Store';
import './SessionReview.scss';
const SessionReview = ({
  match: {
    params: { sessionId },
  },
}) => {
  const [appState, updateState] = useContext(CTX);

  const [formData, setFormData] = useState({ rating: -1, comment: '' });
  let { rating, comment } = formData;
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [err, setErr] = useState('');
  const [redirect, setRedirect] = useState(false);
  const [firstRender, setFirstRender] = useState(true);

  // useEffect(() => {
  //   axios.get('/api/session/');
  // }, []);

  const handleChange = ({ target: { value, id } }) =>
    setFormData((form) => {
      return { ...form, [id]: value };
    });

  const submit = () => {
    if (rating < 0) return setErr('Must select a rating');
    if (comment.length < 20)
      return setErr('Comment must be at least 20 characters');
    axios
      .post(`/api/client/review/${sessionId}`, formData, {
        headers: { 'x-auth-token': appState.user.token },
      })
      .then(({ data: { savedReview, err } }) => {
        if (err) return setErr(err);
        else if (savedReview) setRedirect(true);
      })
      .catch((err) => console.log({ err }));
  };

  useEffect(() => {
    let subscribed = true;
    if (firstRender && subscribed) setFirstRender(false);
    else setTimeout(() => subscribed && setErr(''), 2500);
    return () => (subscribed = false);
  }, [err]);

  return (
    <div className='session-review'>
      {redirect && <Redirect to='/' />}
      <h2>Session Review</h2>
      <select onChange={handleChange} value={rating} id='rating'>
        <option value={-1}>--</option>
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
      />
      {confirmOpen ? (
        <div className='confirm-btns'>
          <button onClick={() => setConfirmOpen(false)}>cancel</button>
          <button onClick={submit}>confirm</button>
        </div>
      ) : (
        <button onClick={() => setConfirmOpen(true)}>submit</button>
      )}
      <p className='err'>{err}</p>
    </div>
  );
};

export default SessionReview;
