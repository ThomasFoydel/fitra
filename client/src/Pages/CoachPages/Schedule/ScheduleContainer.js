import React, { useState, useEffect, useContext } from 'react';
import Schedule from './Schedule';
import axios from 'axios';
import { CTX } from 'context/Store';

const ScheduleContainer = () => {
  const [appState, updateState] = useContext(CTX);
  let { token } = appState.user;
  const [entries, setEntries] = useState(null);

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
      .then(({ data: { entries } }) => setEntries(entries));
  }, []);

  const handleMinimum = (e) => {
    axios
      .get('/api/trainer/minimum/', { headers: { 'x-auth-token': token } })
      .then((res) => console.log({ res }))
      .catch((err) => console.log({ err }));
  };

  return (
    <div className='schedule-container'>
      {entries && (
        <Schedule
          entries={entries}
          change={handleChange}
          handleMinimum={handleMinimum}
        />
      )}
    </div>
  );
};

export default ScheduleContainer;
