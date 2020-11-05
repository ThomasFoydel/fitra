import React from 'react';

const MobileAppointmentSelector = ({ selection, setSelection }) => {
  return (
    <div className='mobile-appointment-selector'>
      <input type='date' />
      <input type='time' />
    </div>
  );
};

export default MobileAppointmentSelector;
