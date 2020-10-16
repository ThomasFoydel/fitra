import React from 'react';
import { Rnd } from 'react-rnd';
import { days, halfHours } from '../../../util/util';
import { Link } from 'react-router-dom';

const Appt = ({ props: { data, inCurrentWeek } }) => {
  let invisible = !inCurrentWeek;

  let t = halfHours.indexOf(data.start);
  let e = halfHours.indexOf(data.end);
  if (t === 47) e = 48;
  e = e - t;
  e *= 50;
  t *= 50;
  let xDefault = days.indexOf(data.day) * 120;

  return (
    <Rnd
      style={{
        position: 'relative',
        zIndex: invisible ? '-1' : '5',
        opacity: invisible ? '0' : '1',
      }}
      className={`rnd-item recurring-${false}`}
      disableDragging={true}
      bounds='parent'
      enableResizing='false'
      default={{
        x: xDefault,
        y: t,
        width: 120,
        height: `${e}px`,
      }}
    >
      <div className='client'>{data.client}</div>

      <Link to={`/coachportal/manage/${data.id}`}>manage</Link>
    </Rnd>
  );
};

export default Appt;
