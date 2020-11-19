import React, { useState } from 'react';
// import TimeInput from 'react-time-input';
import TimePicker from 'react-time-picker';
const MobileSchedule = ({
  props: {
    halfHours,
    days,
    dayOfWeek,
    week,
    blockedTimes,
    setBlockedTimes,
    entries,
    blockEntries,
    setBlockEntries,
  },
}) => {
  // blockedTimes = render, blockEntries = db
  const [dayOpen, setDayOpen] = useState(0);

  return (
    <div className='mb-schedule'>
      <h3 className='title'>schedule</h3>
      {days.map((day, i) => {
        let currentDate = new Date(week[i]);
        return <Day props={{ currentDate, day, blockedTimes }} key={day} />;
      })}
    </div>
  );
};

export default MobileSchedule;

const Day = ({ props: { currentDate, day, blockedTimes } }) => {
  const [addTimeOpen, setAddTimeOpen] = useState(false);
  const [timeSelection, setTimeSelection] = useState({ start: '', end: '' });

  if (timeSelection) console.log('TIME SELECTION!');

  const toggleOpen = () => setAddTimeOpen((o) => !o);

  const handleTimeSelect = ({ target: { id, value } }) => {
    setTimeSelection((s) => {
      return { ...s, [id]: value };
    });
  };

  let { start, end } = timeSelection;
  return (
    <div className='mb-day'>
      <h3>{currentDate.toDateString()}</h3>

      {Object.keys(blockedTimes).map((key) => {
        let { startDate, endDate, _id } = blockedTimes[key];
        startDate = new Date(startDate);
        endDate = new Date(endDate);
        let belongsOnCurrent =
          currentDate.toDateString() === startDate.toDateString();
        if (belongsOnCurrent)
          return (
            <div key={_id}>
              {belongsOnCurrent && (
                <div className='mb-block'>
                  <p>{startDate.toDateString()}</p>
                </div>
              )}
            </div>
          );
      })}
      {addTimeOpen ? (
        <div className='addtime-form'>
          <button onClick={toggleOpen}>
            <i className='fas fa-times fa-2x'></i>
          </button>
          {/* <TimePicker
            className='time-picker'
            onChange={(e) => {
              console.log(e);
            }}
          /> */}
          {/* <input
            type='time'
            step='6'
            id='start'
            value={start}
            onChange={handleTimeSelect}
          /> */}

          {/* 
          <input
            value={end}
            type='time'
            step='600'
            id='end'
            onChange={handleTimeSelect}
          /> */}
          {start && end && <button>submit</button>}
        </div>
      ) : (
        <button className='addtime-btn' onClick={toggleOpen}>
          add time
        </button>
      )}
    </div>
  );
};
