import React, { useState, useEffect, useContext } from 'react';
import Schedule from './Schedule';
import axios from 'axios';
import { CTX } from 'context/Store';

const ScheduleContainer = () => {
  const [appState, updateState] = useContext(CTX);
  let { token } = appState.user;
  const [entries, setEntries] = useState(null);
  const [min, setMin] = useState(1);

  const handleChange = (e) => {
    axios
      .post('/api/trainer/schedule/', e, {
        headers: { 'x-auth-token': token },
      })
      .then(({ data }) => setEntries(data))
      .catch((err) => console.log({ err }));
  };

  useEffect(() => {
    axios
      .get('/api/trainer/schedule/', { headers: { 'x-auth-token': token } })
      .then(({ data: { entries, min } }) => {
        setEntries(entries);
        setMin(min);
      });
  }, []);

  const handleMinimum = ({ target: { value } }) => {
    axios
      .post(
        '/api/trainer/minimum/',
        { value },
        {
          headers: { 'x-auth-token': token },
        }
      )
      .then(({ data: { min } }) => setMin(min))
      .catch((err) => console.log({ err }));
  };

  return (
    <div className='schedule-container'>
      {entries && (
        <Schedule
          entries={entries}
          change={handleChange}
          handleMinimum={handleMinimum}
          min={min}
        />
      )}
    </div>
  );
};

export default ScheduleContainer;
