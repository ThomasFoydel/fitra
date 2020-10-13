import React, { useState, useEffect, useContext } from 'react';
import Schedule from './Schedule';
import axios from 'axios';
import { CTX } from 'context/Store';

const ScheduleContainer = () => {
  const [appState, updateState] = useContext(CTX);
  let { token } = appState.user;
  const [entries, setEntries] = useState(null);
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(3);
  const [err, setErr] = useState('');

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
      .then(({ data: { entries, min, max } }) => {
        setEntries(entries);
        setMin(min);
        setMax(max);
      });
  }, []);

  const handleMinMax = ({ target: { value, id } }) => {
    console.log({ value, id });
    value = Number(value);
    if (id === 'maximum' && value < min)
      return setErr('maximum must be greater than minimum');
    if (id === 'minimum' && value > max)
      return setErr('minimum cannot be greater than maximum');
    axios
      .post(
        `/api/trainer/minmax/${id}/`,
        { value },
        {
          headers: { 'x-auth-token': token },
        }
      )
      .then(({ data: { min, max } }) => {
        console.log({ min, max });
        setMin(min);
        setMax(max);
      })
      .catch((err) => console.log({ err }));
  };

  useEffect(() => {
    setTimeout(() => {
      setErr('');
    }, 2700);
  }, [err]);

  return (
    <div className='schedule-container'>
      {entries && (
        <Schedule
          props={{ min, handleMinMax, max, change: handleChange, entries, err }}
        />
      )}
    </div>
  );
};

export default ScheduleContainer;
