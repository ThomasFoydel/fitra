import axios from 'axios';
import React, { useState, useEffect, useContext, useRef } from 'react';
import {
  days,
  halfHours,
  dateFromDateAndTime,
  setUpWeek,
} from '../../util/util';
import { CTX } from 'context/Store';

import PayPal from 'Components/PayPal/PayPal';

const SessionSelector = ({
  setBookingSuccess,
  bookedTimes,
  belongsToCurrentUser,
  selection,
  setSelection,
  trainer: { availability, _id, minimum, rate, name, active },
}) => {
  const [appState, updateState] = useContext(CTX);
  let { isLoggedIn } = appState;
  const [weekShift, setWeekShift] = useState(0);
  const [week, setWeek] = useState(setUpWeek(0));

  const [mouseIsDown, setMouseIsDown] = useState(false);
  const [minMet, setMinMet] = useState(false);
  const [err, setErr] = useState('');
  const [payPalOpen, setPayPalOpen] = useState(false);

  const mouseDown = () => setMouseIsDown(true);
  const mouseUp = () => setMouseIsDown(false);
  console.log({ active });
  useEffect(() => {
    window.addEventListener('mousedown', mouseDown);
    window.addEventListener('mouseup', mouseUp);
    return () => {
      window.removeEventListener('mousedown', mouseDown);
      window.removeEventListener('mouseup', mouseUp);
    };
  }, []);

  const handleMouseOver = (e) => {
    if (mouseIsDown) {
      handleGridClick(e);
    }
  };

  const handleGridClick = (e) => {
    let { day, hour } = JSON.parse(e.target.id);
    let dayIndex = days.indexOf(day);
    let date = week[dayIndex];
    let hourDate = dateFromDateAndTime(date, hour);

    /* check if hourDate already in selection, if it is, remove it */
    let alreadySelected = false;
    selection.forEach((s) => {
      if (s.hourDate.toString() === hourDate.toString()) alreadySelected = true;
    });

    if (alreadySelected) {
      setSelection((selections) => {
        let filtered = selections.filter(
          (s) => s.hourDate.toString() !== hourDate.toString()
        );

        let sortedFilered = filtered.sort((a, b) => {
          return halfHours.indexOf(a.hour) - halfHours.indexOf(b.hour);
        });

        let allAdjacent = true;
        let lastIndex;
        sortedFilered.forEach((s, i) => {
          if (i > 0) {
            let diff =
              halfHours.indexOf(s.hour) -
              halfHours.indexOf(sortedFilered[i - 1].hour);

            if (diff !== 1) {
              /* selections are not contiguous, selection must be cut */
              lastIndex = i - 1;
              allAdjacent = false;
            }
          }
        });

        if (allAdjacent) return filtered;
        else {
          let newArray = [];
          sortedFilered.forEach((s, i) => {
            if (i <= lastIndex) newArray.push(sortedFilered[i]);
          });
          return newArray;
        }
      });
    } else {
      /* does not yet exist, so add this halfhour to selections
       check if clicked halfhour is adjacent to an item in the selection */
      let adjacent;
      selection.forEach((s) => {
        /* check if date is the same */
        let sYear = s.hourDate.getFullYear();
        let sMonth = s.hourDate.getMonth();
        let sDate = s.hourDate.getDate();

        let year = hourDate.getFullYear();
        let month = hourDate.getMonth();
        let date = hourDate.getDate();
        if (sYear === year && sMonth === month && sDate === date) {
          /* same day */
          let sHour = s.hourDate.getHours();
          let sMinutes = s.hourDate.getMinutes();
          sHour *= 2;
          if (sMinutes === 30) sHour += 1;
          let clickedIndex = halfHours.indexOf(hour);
          if (sHour - clickedIndex === 1 || sHour - clickedIndex === -1) {
            adjacent = true;
          }
        }
      });

      let newTime = {
        day,
        hour,
        hourDate,
      };

      if (adjacent) {
        setSelection((selections) => {
          /* sort selections by hourDate */
          const newArray = [...selections, newTime];
          return newArray.sort((a, b) => a.hourDate - b.hourDate);
        });
      } else {
        setSelection([newTime]);
      }
    }
  };

  useEffect(() => {
    let subscribed = true;
    if (subscribed) setMinMet(minimum <= selection.length);
    return () => (subscribed = false);
  }, [selection, minimum]);

  const didMountRef = useRef(false);
  useEffect(() => {
    let subscribed = true;
    if (didMountRef.current) {
      setTimeout(() => {
        if (subscribed) setErr('');
      }, 2700);
    } else didMountRef.current = true;
    return () => (subscribed = false);
  }, [err]);

  const shiftWeek = (n) => {
    setWeek(setUpWeek(n));
    setWeekShift(n);
  };

  const handleBooking = (order) => {
    setPayPalOpen(false);

    if (belongsToCurrentUser) return setErr("you can't book yourself!");
    if (!minMet)
      return setErr(`minimum time for booking is ${minimum * 60} minutes`);

    let startTime = selection[0].hourDate.toUTCString();
    let endTimeDate = new Date(
      selection[selection.length - 1].hourDate.getTime()
    );
    endTimeDate.setMinutes(endTimeDate.getMinutes() + 30);
    let endTime = endTimeDate.toUTCString();

    let token = localStorage.getItem('fitr-token');
    axios
      .post(
        '/api/session/new',
        { startTime, endTime, order, trainer: _id },
        {
          headers: { 'x-auth-token': token },
        }
      )
      .then(({ data: { err, newSession } }) => {
        if (err) {
          setErr(err);
          setSelection([]);
        } else if (newSession) setBookingSuccess(true);
      });
  };

  const showRegister = () => {
    updateState({ type: 'CHANGE_AUTH_PAGE', payload: { page: 'register' } });
    updateState({ type: 'TOGGLE_AUTH' });
  };

  let startTime = selection[0] ? selection[0].hourDate.toUTCString() : '';
  let endTime = selection[selection.length - 1]
    ? selection[selection.length - 1].hourDate.toUTCString()
    : '';

  const handlePayPalOpen = () => {
    isLoggedIn ? setPayPalOpen(true) : showRegister();
  };

  let selectionStart = selection[0];
  if (selectionStart) {
    selectionStart.dateString = selectionStart.hourDate.toDateString();
  }

  let selectionEnd = {};
  let selectionRangeEnd = selection[selection.length - 1];
  if (selectionRangeEnd) {
    selectionEnd.hour =
      halfHours[halfHours.indexOf(selectionRangeEnd.hour) + 1];
    let today = selection[selection.length - 1].day;
    let todayIndex = days.indexOf(today);
    let endIsMidnight = selectionEnd.hour === '12:00 AM';
    let tomorrow =
      todayIndex < days.length - 1 ? days[days.indexOf(today) + 1] : days[0];
    selectionEnd.day = endIsMidnight ? tomorrow : today;
    let tomorrowDate = new Date(
      selection[selection.length - 1].hourDate.getTime() + 86400000
    );
    let todayHourDate = selection[selection.length - 1].hourDate.toDateString();
    selectionEnd.dateString = endIsMidnight
      ? tomorrowDate.toDateString()
      : todayHourDate;
  }
  let price = rate * selection.length;
  if (!rate && rate !== 0) price = 50;
  if (isNaN(price)) price = 50;
  if (price === 0) price = 0.01;
  return (
    <div className='session-selector'>
      <div className='ctrls'>
        <div className='weekshift-btns'>
          <button
            className='weekshift-btn'
            onClick={() => shiftWeek(weekShift - 1)}
          >
            <i className='far fa-arrow-alt-circle-left fa-4x'></i>
          </button>
          <button
            className='weekshift-btn'
            onClick={() => shiftWeek(weekShift + 1)}
          >
            <i className='far fa-arrow-alt-circle-right fa-4x'></i>
          </button>
        </div>
        <div className='booking'>
          {isNaN(minimum) || minimum <= 0 || !active ? (
            <p>this trainer's scheduling is not set up</p>
          ) : (
            <>
              {selectionStart ? (
                <>
                  <div className='beginning'>
                    {selectionStart.day} - {selectionStart.hour} -{' '}
                    {selectionStart.dateString}
                  </div>
                  <div className='end'>
                    {selectionEnd.day} - {selectionEnd.hour} -{' '}
                    {selectionEnd.dateString}
                  </div>
                </>
              ) : (
                <p>Select time below, miminum: {minimum * 30} minutes</p>
              )}
              {selection && selection.length > 0 && (
                <button
                  className={`booking-btn minmet-${minMet}`}
                  onClick={handlePayPalOpen}
                >
                  book
                </button>
              )}
            </>
          )}

          {err && <p className='err'>{err}</p>}
        </div>
      </div>

      <div className='relative-container'>
        <div className='labels'>
          {Object.keys(week).map((key, i) => {
            let day = week[key];
            let string = day
              .toDateString()
              .substring(0, day.toDateString().length - 4);
            return (
              <div
                className='day-label'
                //   className={`day-label today-${today === i && weekShift === 0}`}
                key={key}
              >
                {string}
              </div>
            );
          })}
        </div>
        <div className='drag-n-drop'>
          {
            //////////////////////////
            //   background grid
            //////////////////////////
          }
          <div className='time-grid'>
            {days.map((day) => (
              <div className='grid-day' key={day}>
                {halfHours.map((hour, i) => {
                  if (i < 48) {
                    let selected;
                    let blocked;
                    let dayIndex = days.indexOf(day);
                    let dayDate = week[dayIndex];
                    let hourDate = dateFromDateAndTime(dayDate, hour);
                    selection.forEach((s) => {
                      if (s.hourDate.toString() === hourDate.toString())
                        selected = true;
                    });
                    if (availability)
                      availability.forEach((entry) => {
                        let startDate = new Date(entry.startDate);
                        let endDate = new Date(entry.endDate);
                        if (hourDate >= startDate && hourDate < endDate)
                          blocked = true;
                      });
                    if (bookedTimes) {
                      bookedTimes.forEach((time) => {
                        let startDate = new Date(time.startTime);
                        let endDate = new Date(time.endTime);
                        if (hourDate >= startDate && hourDate < endDate)
                          blocked = true;
                      });
                    }
                    return (
                      <div
                        className={`grid-time ${selected && 'selected-true'} ${
                          blocked && 'unavailable'
                        }`}
                        style={{
                          background: `rgb(${0 + i * 2}, ${110 - i / 2}, ${
                            159 + i * 2
                          })`,
                        }}
                        key={hour}
                        id={JSON.stringify({ day, hour })}
                        onMouseOver={blocked ? () => {} : handleMouseOver}
                        onMouseDown={blocked ? () => {} : handleGridClick}
                      >
                        {hour}
                      </div>
                    );
                  } else return null;
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {payPalOpen && (
        <PayPal
          props={{
            desc: `Booking ${name} for ${startTime} - ${endTime}`,
            price,
            complete: handleBooking,
            setPayPalOpen,
          }}
        />
      )}
    </div>
  );
};

export default SessionSelector;
