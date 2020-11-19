import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Dnd from './Dnd';
import Appt from './Appt';
import {
  days,
  halfHours,
  getOneHalfHourAhead,
  dateFromDateAndTime,
  setUpWeek,
  checkBlock,
} from '../../../util/util';
import './Schedule.scss';
import MobileSchedule from './MobileSchedule';

// todos:
// double check values across blockentries and blocktimes for all changes

let current = new Date();
let dayOfWeek = current.getDay();

let currentWeek = setUpWeek(0);

const Schedule = ({
  props: {
    change,
    entries,
    handleMinMax,
    max,
    min,
    err,
    appointments,
    setAppointments,
  },
}) => {
  const [weekShift, setWeekShift] = useState(0);
  const [week, setWeek] = useState(currentWeek);
  const [blockedTimes, setBlockedTimes] = useState(entries);
  const [blockEntries, setBlockEntries] = useState(entries);
  const [firstRender, setFirstRender] = useState(true);

  useEffect(() => {
    let subscribed = true;
    if (subscribed)
      if (firstRender) setFirstRender(false);
      else change(blockEntries);
    return () => (subscribed = false);
  }, [blockEntries]);

  const destroy = (id) => {
    setBlockedTimes((blocks) => {
      let block = blocks.filter((b) => b.id === id)[0];
      let index = blocks.indexOf(block);
      let copy = [...blocks];
      copy[index].invisible = true;
      return blocks;
    });
    setBlockEntries((blocks) => blocks.filter((block) => block.id !== id));
  };

  const handleGridClick = (e) => {
    let { day, hour } = JSON.parse(e.target.id);
    let dayIndex = days.indexOf(day);
    let clicked = week[dayIndex];
    let clickedDate = clicked.getDate();
    let clickedMonth = Number(clicked.getMonth());
    let clickedYear = clicked.getFullYear();

    let cDate = new Date(clickedYear, clickedMonth, clickedDate);
    let startDate = dateFromDateAndTime(cDate, hour);

    let endTime = startDate.getTime() + 1800000;
    let endDate = new Date(endTime);
    let endHour = getOneHalfHourAhead(hour);
    const newBlock = {
      startDate,
      endDate,
      start: hour,
      end: endHour,
      day,
      title: '',
      recurring: false,
      id: uuidv4(),
    };
    setBlockedTimes([...blockedTimes, newBlock]);
    setBlockEntries([...blockEntries, newBlock]);
  };

  const handleWeekShift = (newShift) => {
    setWeek(setUpWeek(newShift));
    setWeekShift(newShift);
  };

  const newDate = new Date();
  const today = newDate.getDay();

  const handleDndEntries = (e) => {
    setBlockEntries(e);
  };
  const handleBlockedTimes = (e) => {
    setBlockedTimes(e);
  };
  return (
    <div className='schedule'>
      <div className='background'></div>
      <div className='ctrl-panel'>
        <div className='min-and-max'>
          <div className='min-max'>
            <h4>min</h4>
            <select onChange={handleMinMax} value={min} id='minimum'>
              <option value={1}>30 minutes</option>
              <option value={2}>1 hour</option>
              <option value={3}>1.5 hours</option>
              <option value={4}>2 hours</option>
            </select>
          </div>
          <div className='min-max'>
            <h4>max</h4>
            <select onChange={handleMinMax} value={max} id='maximum'>
              <option value={1}>30 minutes</option>
              <option value={2}>1 hour</option>
              <option value={3}>1.5 hours</option>
              <option value={4}>2 hours</option>
            </select>
          </div>
        </div>

        <div className='weekshift-btns'>
          <button onClick={() => handleWeekShift(weekShift - 1)}>
            <i className='far fa-arrow-alt-circle-left fa-4x'></i>
          </button>
          <button onClick={() => handleWeekShift(weekShift + 1)}>
            <i className='far fa-arrow-alt-circle-right fa-4x'></i>
          </button>
        </div>
      </div>
      <p className='err'>{err}</p>
      <div className='schedule-spacer'></div>
      <div className='dnd'>
        <div className='large-schedule'>
          <div className='drag-n-drop'>
            <div className='labels'>
              {Object.keys(week).map((key, i) => {
                let day = week[key];
                let string = day
                  .toDateString()
                  .substring(0, day.toDateString().length - 4);
                return (
                  <div
                    className={`day-label today-${
                      today === i && weekShift === 0
                    }`}
                    key={key}
                  >
                    {string}
                  </div>
                );
              })}
            </div>
            {
              //////////////////////////
              //   background grid
              //////////////////////////
            }
            <div className='time-grid'>
              {days.map((day) => (
                <div className='grid-day' key={day}>
                  {halfHours.map((hour, i) => {
                    if (i < 48)
                      return (
                        <div
                          className='grid-time'
                          style={{
                            background: `rgb(${0 + i * 2}, ${110 - i / 2}, ${
                              159 + i * 2
                            })`,
                          }}
                          key={hour}
                          id={JSON.stringify({ day, hour })}
                          onClick={handleGridClick}
                        >
                          {hour}
                        </div>
                      );
                    else return null;
                  })}
                </div>
              ))}
            </div>

            {
              //////////////////////////////
              ///// APPOINTMENTS ///////////
              //////////////////////////////

              appointments.map((data) => {
                const inCurrentWeek = checkBlock(data, week);

                return (
                  <Appt
                    props={{ data, inCurrentWeek, setAppointments }}
                    key={data.id}
                  />
                );
              })
            }

            {
              //////////////////////////////
              // drag and drop time blocks
              //////////////////////////////
            }
            {blockedTimes.map((data) => {
              const inCurrentWeek = checkBlock(data, week);

              return (
                <Dnd
                  invisible={inCurrentWeek ? data.invisible : true}
                  data={data}
                  destroy={destroy}
                  key={data.id}
                  week={week}
                  currentDay={dayOfWeek}
                  days={days}
                  times={halfHours}
                  setBlockEntries={handleDndEntries}
                  setBlockedTimes={handleBlockedTimes}
                />
              );
            })}
          </div>
        </div>
      </div>
      <MobileSchedule
        props={{
          halfHours,
          days,
          dayOfWeek,
          week,
          blockedTimes,
          setBlockedTimes,
          entries,
          blockEntries,
          setBlockEntries,
        }}
      />
    </div>
  );
};

export default Schedule;
