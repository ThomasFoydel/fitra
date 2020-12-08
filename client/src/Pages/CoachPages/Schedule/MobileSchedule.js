import React, { useState } from 'react';

const MobileSchedule = ({
  props: {
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
  const [timeSelection, setTimeSelection] = useState({ start: {}, end: {} });

  const toggleOpen = () => setAddTimeOpen((o) => !o);

  const handleTimeSelect = ({ id, value, label }) => {
    setTimeSelection((s) => {
      return { ...s, [label]: { ...s[label], [id]: value } };
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

      <div
        className='addtime-form'
        style={{
          height: addTimeOpen ? '16rem' : '0rem',
          transition: 'all 0.3s ease',
          overflow: 'hidden',
        }}
      >
        <button className='close-btn' onClick={toggleOpen}>
          <i className='fas fa-times fa-2x'></i>
        </button>
        <TimeInput id='start' label='start' onChange={handleTimeSelect} />
        <TimeInput id='end' label='end' onChange={handleTimeSelect} />
        {start && end && (
          <button
            onClick={() => {
              console.log({ timeSelection });
            }}
          >
            submit
          </button>
        )}
      </div>

      {!addTimeOpen && (
        <button className='addtime-btn' onClick={toggleOpen}>
          add time
        </button>
      )}
    </div>
  );
};

const hours = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const TimeInput = ({ onChange, label }) => {
  const handleChange = ({ target: { value, id } }) => {
    onChange({ value, id, label });
  };

  return (
    <div className='timeinput'>
      <div className='label'>{label}</div>
      <div className='selectors'>
        <h6>hr</h6>
        <select onChange={handleChange} id='hour'>
          {hours.map((h) => (
            <option key={h} value={h}>
              {h}
            </option>
          ))}
        </select>
        <h6>min</h6>
        <select onChange={handleChange} id='minute'>
          <option value={0}>00</option>
          <option value={30}>30</option>
        </select>

        <select onChange={handleChange} id='amOrPm'>
          <option value='AM'>AM</option>
          <option value='PM'>PM</option>
        </select>
      </div>
    </div>
  );
};
