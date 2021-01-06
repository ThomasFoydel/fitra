import React, { useState } from 'react';
import { dateFromDateAndTime } from '../../../util/util';
import { v4 as uuidv4 } from 'uuid';
const MobileSchedule = ({
  props: {
    days,
    week,
    displayBlocks,
    // dayOfWeek,
    setDisplayBlocks,
    // entries,
    // actualBlocks,
    setActualBlocks,
  },
}) => {
  const handleSubmitTime = ({ timeSelection: { start, end }, day }) => {
    const selectedDate = week[days.indexOf(day)];
    const startTime = `${start.hour}:${start.minute} ${start.amOrPm}`;
    const endTime = `${end.hour}:${end.minute} ${end.amOrPm}`;
    const startDate = dateFromDateAndTime(selectedDate, startTime);
    const endDate = dateFromDateAndTime(selectedDate, endTime);

    const newBlock = {
      startDate,
      endDate,
      start: startTime,
      end: endTime,
      day,
      title: '',
      recurring: false,
      id: uuidv4(),
    };

    setDisplayBlocks([...displayBlocks, newBlock]);
    setActualBlocks((actualBlocks) => [...actualBlocks, newBlock]);
  };

  return (
    <div className='mb-schedule'>
      <h3 className='title'>schedule</h3>
      {days.map((day, i) => {
        const currentDate = new Date(week[i]);
        return (
          <Day
            props={{ currentDate, day, displayBlocks, handleSubmitTime }}
            key={day}
          />
        );
      })}
    </div>
  );
};

export default MobileSchedule;

const Day = ({
  props: { currentDate, day, displayBlocks, handleSubmitTime },
}) => {
  const [addTimeOpen, setAddTimeOpen] = useState(false);
  const [timeSelection, setTimeSelection] = useState({
    start: {
      amOrPm: 'AM',
      hour: '1',
      minute: '00',
    },
    end: {
      amOrPm: 'PM',
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
          <i className='fas fa-times fa-2x'></i>
        </button>
        <TimeInput
          props={{
            id: 'start',
            label: 'start',
            value: timeSelection.start,
            handleTimeSelect,
          }}
        />
        <TimeInput
          props={{
            id: 'end',
            label: 'end',
            value: timeSelection.end,
            handleTimeSelect,
          }}
        />
        {start && end && (
          <button onClick={() => handleSubmitTime({ timeSelection, day })}>
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

const TimeInput = ({ props: { handleTimeSelect, label, value } }) => {
  const { hour, minute, amOrPm } = value;

  const handleChange = ({ target: { value, id } }) => {
    console.log({ value });
    handleTimeSelect({ value, id, label });
  };
  return (
    <div className='timeinput'>
      <div className='label'>{label}</div>
      <div className='selectors'>
        <h6>hr</h6>
        <select onChange={handleChange} id='hour' value={hour}>
          {hours.map((h) => (
            <option key={h} value={h}>
              {h}
            </option>
          ))}
        </select>
        <h6>min</h6>
        <select onChange={handleChange} id='minute' value={minute}>
          <option value='00'>00</option>
          <option value='30'>30</option>
        </select>

        <select onChange={handleChange} id='amOrPm' value={amOrPm}>
          <option value='AM'>AM</option>
          <option value='PM'>PM</option>
        </select>
      </div>
    </div>
  );
};
