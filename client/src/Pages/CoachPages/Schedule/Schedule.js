import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Dnd from './parts/Dnd';
import Session from './parts/Session';
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
import MinMax from './parts/MinMax';
import Labels from './parts/Labels';

const current = new Date();
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
    sessions,
    setSessions,
  },
}) => {
  const [weekShift, setWeekShift] = useState(0);
  const [week, setWeek] = useState(currentWeek);
  const [displayBlocks, setDisplayBlocks] = useState(entries);
  const [actualBlocks, setActualBlocks] = useState(entries);
  const [firstRender, setFirstRender] = useState(true);

  // todo: test this:
  // const didMountRef = useRef(false);
  // useEffect(() => {
  //   let subscribed = true;
  //   if (didMountRef.current) {
  //    change(actualBlocks);
  //   } else didMountRef.current = true;
  //   return () => (subscribed = false);
  // }, [actualBlocks]);

  useEffect(() => {
    let subscribed = true;
    if (subscribed)
      if (firstRender) setFirstRender(false);
      else change(actualBlocks);
    return () => (subscribed = false);
  }, [actualBlocks]);

  const destroy = (id) => {
    setDisplayBlocks((blocks) => {
      const block = blocks.filter((b) => b.id === id)[0];
      const index = blocks.indexOf(block);
      const copy = [...blocks];
      copy[index].invisible = true;
      return blocks;
    });
    setActualBlocks((blocks) => blocks.filter((block) => block.id !== id));
  };

  const handleGridClick = (e) => {
    const { day, hour } = JSON.parse(e.target.id);
    const dayIndex = days.indexOf(day);
    const clicked = week[dayIndex];
    const clickedDate = clicked.getDate();
    const clickedMonth = clicked.getMonth();
    const clickedYear = clicked.getFullYear();

    const cDate = new Date(clickedYear, clickedMonth, clickedDate);
    const startDate = dateFromDateAndTime(cDate, hour);

    const endTime = startDate.getTime() + 1800000;
    const endDate = new Date(endTime);
    const endHour = getOneHalfHourAhead(hour);

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
    setDisplayBlocks([...displayBlocks, newBlock]);
    setActualBlocks([...actualBlocks, newBlock]);
  };

  const handleWeekShift = (newShift) => {
    setWeek(setUpWeek(newShift));
    setWeekShift(newShift);
  };

  const newDate = new Date();
  const today = newDate.getDay();

  return (
    <>
      <div className='background' />
      <div className='overlay' />
      <div className='schedule'>
        <div className='ctrl-panel'>
          <MinMax props={{ handleMinMax, min, max }} />

          <div className='weekshift-btns'>
            <button onClick={() => handleWeekShift(weekShift - 1)}>
              <i className='far fa-arrow-alt-circle-left fa-4x' />
            </button>
            <button onClick={() => handleWeekShift(weekShift + 1)}>
              <i className='far fa-arrow-alt-circle-right fa-4x' />
            </button>
          </div>
        </div>

        <p
          className='err'
          style={{ background: err ? 'black' : 'rgba(0,0,0,0)' }}
        >
          {err}
        </p>

        <div className='schedule-spacer' />

        <div className='large-schedule'>
          <div className='drag-n-drop'>
            <Labels props={{ week, weekShift, today }} />

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

            {sessions.map((data) => {
              const inCurrentWeek = checkBlock(data, week);
              return (
                <Session
                  props={{ data, inCurrentWeek, setSessions }}
                  key={data.id}
                />
              );
            })}

            {displayBlocks.map((data) => {
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
                  setActualBlocks={setActualBlocks}
                  setDisplayBlocks={setDisplayBlocks}
                />
              );
            })}
          </div>
        </div>

        <MobileSchedule
          props={{
            halfHours,
            days,
            dayOfWeek,
            week,
            displayBlocks,
            setDisplayBlocks,
            entries,
            actualBlocks,
            setActualBlocks,
          }}
        />
      </div>
    </>
  );
};

export default Schedule;
