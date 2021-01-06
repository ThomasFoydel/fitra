import React, { useState } from 'react';

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

export default TimeInput;
