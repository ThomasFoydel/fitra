import React, { useState, useEffect } from 'react';
import {
  days,
  halfHours,
  getOneHalfHourAhead,
  dateFromDateAndTime,
  setUpWeek,
  checkBlock,
  checkSelection,
} from '../../util/util';
const AppointmentSelector = ({ entries }) => {
  const [week, setWeek] = useState(setUpWeek(0));
  const [selection, setSelection] = useState([]);
  const [mouseIsDown, setMouseIsDown] = useState(false);

  useEffect(() => {
    window.addEventListener('mousedown', () => setMouseIsDown(true));
    window.addEventListener('mouseup', () => setMouseIsDown(false));
  });

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

    // check if hourDate already in selection, if it is, remove it
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
              // selections are not all adjacent, must be cut
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
      // does not yet exist, so add this halfhour to selections
      // check if clicked halfhour is adjacent to an item in the selection
      let adjacent;
      selection.forEach((s) => {
        // check if date is the same
        let sYear = s.hourDate.getFullYear();
        let sMonth = s.hourDate.getMonth();
        let sDate = s.hourDate.getDate();

        let year = hourDate.getFullYear();
        let month = hourDate.getMonth();
        let date = hourDate.getDate();
        if (sYear === year && sMonth === month && sDate === date) {
          // same day
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
        setSelection((selections) => [...selections, newTime]);
      } else {
        setSelection([newTime]);
      }
    }
  };

  return (
    <div className='appointmentselector'>
      <h2>AppointmentSelector</h2>
      {/* {selection.map((m, i) => (
        <div key={i}>
          {m.day} - {m.hour} - {m.hourDate.toDateString()}
        </div>
      ))} */}
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

      <div className='absolute'>
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
                  //   let selected = checkSelection(hour, hourDate, selection);
                  if (i < 48) {
                    let selected;
                    let dayIndex = days.indexOf(day);
                    let dayDate = week[dayIndex];
                    let hourDate = dateFromDateAndTime(dayDate, hour);
                    selection.forEach((s) => {
                      if (s.hourDate.toString() === hourDate.toString())
                        selected = true;
                    });

                    return (
                      <div
                        className={`grid-time ${selected && 'selected-true'}`}
                        style={{
                          background: `rgb(${0 + i * 2}, ${110 - i / 2}, ${
                            159 + i * 2
                          })`,
                        }}
                        key={hour}
                        id={JSON.stringify({ day, hour })}
                        // onClick={handleGridClick}
                        onMouseOver={handleMouseOver}
                        onMouseDown={handleGridClick}
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
    </div>
  );
};

export default AppointmentSelector;
