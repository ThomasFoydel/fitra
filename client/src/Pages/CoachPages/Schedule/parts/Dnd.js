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

  let startIdx = times.indexOf(data.start);
  let endIdx = times.indexOf(data.end);
  if (startIdx === 47) endIdx = 48;
  let initialHeight = endIdx - startIdx;
  initialHeight *= 50;
  startIdx *= 50;
  const xDefault = days.indexOf(data.day) * 120;

  const handleDestroy = () => {
    destroy(data.id);
  };

  const updateBlocks = (startDate, endDate, startTime, endTime, recurring) => {
    const day = days[startDate.getDay()];
    const newTime = {
      day,
      end: endTime,
      start: startTime,
      startDate,
      endDate,
      id: data.id,
      recurring,
    };
    setDisplayBlocks((times) => {
      const index = times.findIndex((x) => x.id === data.id);
      const copy = [...times];
      copy[index] = newTime;
      return copy;
    });
    setActualBlocks((entries) => {
      const index = entries.findIndex((x) => x.id === data.id);
      const copy = [...entries];
      copy[index] = newTime;
      return copy;
    });
  };

  const handleDrag = (e, el) => {
    let { node } = el;
    let { transform, height } = node.style;

    /* NEW DAY */
    let elementXPosition = el.x;
    elementXPosition -= 60;
    let x = Math.ceil(elementXPosition / 120);

    /* NEW START TIME */
    let elementYPosition = transform.split(', ')[1];
    elementYPosition = elementYPosition.substring(
      0,
      elementYPosition.length - 3
    );
    elementYPosition = Number(elementYPosition);

    if (elementYPosition < 50 && elementYPosition > -50) elementYPosition = 0;
    if (elementYPosition < 0) elementYPosition += 2750;
    const startIndex = Math.ceil(elementYPosition / 50);

    const mSecondsInADay = 86400000;
    const index = x - days.indexOf(day);
    const timeDifference = mSecondsInADay * index;
    const prevDate = week[days.indexOf(day)];
    const newDate = new Date(prevDate.getTime() + timeDifference);
    const newStartTime = times[startIndex];
    const newStartDate = dateFromDateAndTime(newDate, newStartTime);

    /* NEW END TIME */
    if (Number(height) < 0) height = 0;
    let elementHeight = height.substring(0, height.length - 2);
    elementHeight /= 50;
    const endTime = times[startIndex + elementHeight];
    const newEndDate = dateFromDateAndTime(newDate, endTime, newStartTime);

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
    let elementYPosition = transform.split(', ')[1];
    elementYPosition = elementYPosition.substring(
      0,
      elementYPosition.length - 3
    );
    const start = times[elementYPosition / 50];
    let elementHeight = height.substring(0, height.length - 2);
    elementHeight /= 50;
    const startIndex = times.indexOf(start);
    const newEndTime = times[startIndex + elementHeight];
    if (newEndTime && newEndTime !== startTime) {
      setEndTime(newEndTime);

      const newEndDate = dateFromDateAndTime(endDate, newEndTime, startTime);
      const newStartDate = dateFromDateAndTime(endDate, startTime);
      setEndDate(newEndDate);
      updateBlocks(newStartDate, newEndDate, startTime, newEndTime, recurring);
    }
  };

  const toggleRecurring = () => {
    const dayOfWeek = startDate.getDay();
    const currentWeekDate = week[dayOfWeek];
    const newStartDate = dateFromDateAndTime(currentWeekDate, startTime);
    setStartDate(newStartDate);
    const newEndDate = dateFromDateAndTime(currentWeekDate, endTime, startTime);
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
        y: startIdx,
        width: 120,
        height: `${initialHeight}px`,
      }}
      onDragStop={handleDrag}
      onResizeStop={handleResize}
    >
      <div>
        <p className='item-day'>{day}</p>

        <button
          className='delete-btn'
          onMouseDown={(event) => event.stopPropagation()}
          onClick={handleDestroy}
        >
          X
        </button>
        <p className='item-time'>
          {startTime} - {endTime}
        </p>
        <button
          className='recurring-btn'
          onClick={toggleRecurring}
          onMouseDown={(event) => event.stopPropagation()}
        >
          R
        </button>
      </div>
    </Rnd>
  );
};

export default Dnd;
