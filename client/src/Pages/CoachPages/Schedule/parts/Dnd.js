import React, { useState, useEffect } from 'react';
import { Rnd } from 'react-rnd';
import { dateFromDateAndTime } from '../../../../util/util';
const Dnd = ({
  data,
  destroy,
  week,
  days,
  times,
  setDisplayBlocks,
  setActualBlocks,
  invisible,
}) => {
  const [day, setDay] = useState(data.day);
  const [startTime, setStartTime] = useState(data.start);
  const [endTime, setEndTime] = useState(data.end);
  const [startDate, setStartDate] = useState(new Date(data.startDate));
  const [endDate, setEndDate] = useState(new Date(data.endDate));
  const [recurring, setRecurring] = useState(data.recurring);
  const [firstLoad, setFirstLoad] = useState(true);

  let t = times.indexOf(data.start);
  let e = times.indexOf(data.end);
  if (t === 47) e = 48;
  e = e - t;
  e *= 50;
  t *= 50;
  let xDefault = days.indexOf(data.day) * 120;

  const handleDestroy = () => {
    destroy(data.id);
  };

  const updateBlocks = (startDate, endDate, startTime, endTime, recurring) => {
    let day = days[startDate.getDay()];
    let newTime = {
      day,
      end: endTime,
      start: startTime,
      startDate,
      endDate,
      id: data.id,
      recurring,
    };
    setDisplayBlocks((times) => {
      let index = times.findIndex((x) => x.id === data.id);
      let copy = [...times];
      copy[index] = newTime;
      return copy;
    });
    setActualBlocks((entries) => {
      let index = entries.findIndex((x) => x.id === data.id);
      let copy = [...entries];
      copy[index] = newTime;
      return copy;
    });
  };

  const handleDrag = (e, el) => {
    let { node } = el;
    let { transform, height } = node.style;

    /* NEW DAY */
    let elX = el.x;
    elX -= 60;
    let x = Math.ceil(elX / 120);

    /* NEW START TIME */
    let y = transform.split(', ')[1];
    y = y.substring(0, y.length - 3);
    y = Number(y);

    if (y < 50 && y > -50) y = 0;
    if (y < 0) y += 2750;
    let startIndex = Math.ceil(y / 50);

    let mSecondsInADay = 86400000;
    let index = x - days.indexOf(day);
    const timeDifference = mSecondsInADay * index;
    const prevDate = week[days.indexOf(day)];
    let newDate = new Date(prevDate.getTime() + timeDifference);
    let newStartTime = times[startIndex];
    let newStartDate = dateFromDateAndTime(newDate, newStartTime);

    /* NEW END TIME */
    if (Number(height) < 0) height = 0;
    let h = height.substring(0, height.length - 2);
    h /= 50;
    let endTime = times[startIndex + h];
    let newEndDate = dateFromDateAndTime(newDate, endTime, newStartTime);

    /* UPDATE STATE */
    setStartTime(times[startIndex]);
    setEndTime(endTime);
    setStartDate(newStartDate);
    setEndDate(newEndDate);
    setDay(days[x]);
    updateBlocks(newStartDate, newEndDate, newStartTime, endTime, recurring);
  };

  const handleResize = (e, dir, refToElement, d) => {
    let { transform, height } = refToElement.style;
    let y = transform.split(', ')[1];
    y = y.substring(0, y.length - 3);
    let start = times[y / 50];
    let h = height.substring(0, height.length - 2);
    h /= 50;
    let startIndex = times.indexOf(start);
    let newEndTime = times[startIndex + h];
    if (newEndTime && newEndTime !== startTime) {
      setEndTime(newEndTime);

      let newEndDate = dateFromDateAndTime(endDate, newEndTime, startTime);
      let newStartDate = dateFromDateAndTime(endDate, startTime);
      setEndDate(newEndDate);
      updateBlocks(newStartDate, newEndDate, startTime, newEndTime, recurring);
    }
  };

  const toggleRecurring = () => {
    let dayOfWeek = startDate.getDay();
    let currentWeekDate = week[dayOfWeek];
    let newStartDate = dateFromDateAndTime(currentWeekDate, startTime);
    setStartDate(newStartDate);
    let newEndDate = dateFromDateAndTime(currentWeekDate, endTime, startTime);
    setEndDate(newEndDate);
    setRecurring((recurring) => {
      return !recurring;
    });
  };

  useEffect(() => {
    if (firstLoad) {
      setFirstLoad(false);
    } else {
      updateBlocks(startDate, endDate, startTime, endTime, recurring);
    }
  }, [recurring]);
  return (
    <Rnd
      style={{
        position: 'absolute',
        zIndex: invisible ? '-1' : '1',
        opacity: invisible ? '0' : '1',
      }}
      className={`rnd-item rnd-blocked-time recurring-${recurring}`}
      bounds='parent'
      resizeGrid={[0, 50]}
      dragGrid={[120, 50]}
      enableResizing={{ bottom: true }}
      resizeHandleClasses={{ bottom: 'drag-bottom' }}
      default={{
        x: xDefault,
        y: t,
        width: 120,
        height: `${e}px`,
      }}
      onDragStop={handleDrag}
      onResizeStop={handleResize}
    >
      <div>
        <p>{day}</p>

        <button
          className='delete-btn'
          onMouseDown={(e) => e.stopPropagation()}
          onClick={handleDestroy}
        >
          X
        </button>
        <p>
          {startTime} - {endTime}
        </p>
        <button
          className='recurring-btn'
          onClick={toggleRecurring}
          onMouseDown={(e) => e.stopPropagation()}
        >
          R
        </button>
      </div>
    </Rnd>
  );
};

export default Dnd;
