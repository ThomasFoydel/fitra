import React, { useState } from 'react';
import axios from 'axios';
const SessionReview = ({
  match: {
    params: { sessionId },
  },
}) => {
  const [formData, setFormData] = useState({ rating: 2, comment: '' });
  let { rating, comment } = formData;

  const handleChange = ({ target: { value, id } }) =>
    setFormData((f) => {
      return { ...f, [id]: value };
    });

  const submit = () => {
    axios.post(`/api/client/review/${sessionId}`, formData);
  };
  return (
    <div className='session-review'>
      <h2>SessionReview</h2>
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
    </div>
  );
};

export default SessionReview;
