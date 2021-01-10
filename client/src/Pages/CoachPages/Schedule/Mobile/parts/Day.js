import React, { useState } from 'react';
import TimeInput from './TimeInput';

const Day = ({
  props: { currentDate, day, displayBlocks, handleSubmitTime },
}) => {
  const [addTimeOpen, setAddTimeOpen] = useState(false);
  const [err, setErr] = useState('');

  const [timeSelection, setTimeSelection] = useState({
    start: {
      amOrPm: 'AM',
      hour: '1',
      minute: '00',
    },
    end: {
      amOrPm: 'AM',
      hour: '1',
      minute: '30',
    },
  });

  const toggleOpen = () => setAddTimeOpen((o) => !o);

  const handleTimeSelect = ({ id, value, label }) => {
    setTimeSelection((s) => {
      return { ...s, [label]: { ...s[label], [id]: value } };
    });
  };

  const { start, end } = timeSelection;

  return (
    <div className='mb-day'>
      <h3>{currentDate.toDateString()}</h3>

      {Object.keys(displayBlocks).map((key) => {
        let { startDate, endDate, _id, id } = displayBlocks[key];
        startDate = new Date(startDate);
        endDate = new Date(endDate);
        const belongsOnCurrent =
          currentDate.toDateString() === startDate.toDateString();

        return belongsOnCurrent ? (
          <div key={_id || id}>
            {belongsOnCurrent && (
              <div className='mb-block'>
                <p>start: {startDate.toDateString()}</p>
                <p>end: {endDate.toDateString()}</p>
              </div>
            )}
          </div>
        ) : null;
      })}

      <div
        className='addtime-form'
        style={{
          height: addTimeOpen ? '16rem' : '0rem',
          transition: 'all 0.3s ease',
          overflow: 'hidden',
        }}
      >
        <button className='close-btn' onClick={toggleOpen}>
          <i className='fas fa-times fa-2x' />
        </button>

        <TimeInput
          props={{
            id: 'start',
            label: 'start',
            value: start,
            handleTimeSelect,
          }}
        />
        <TimeInput
          props={{
            id: 'end',
            label: 'end',
            value: end,
            handleTimeSelect,
          }}
        />
        <button onClick={() => handleSubmitTime({ timeSelection, day })}>
          submit
        </button>
      </div>

      {!addTimeOpen && (
        <button className='addtime-btn' onClick={toggleOpen}>
          add time
        </button>
      )}
    </div>
  );
};

export default Day;
