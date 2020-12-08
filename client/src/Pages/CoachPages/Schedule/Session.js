import React from 'react';
import { Rnd } from 'react-rnd';
import { days, halfHours } from '../../../util/util';
import { Link } from 'react-router-dom';
import Image from 'Components/Image/Image';

const Session = ({ props: { data, inCurrentWeek } }) => {
  let invisible = !inCurrentWeek;

  let startIdx = halfHours.indexOf(data.start);
  let endIdx = halfHours.indexOf(data.end);
  if (startIdx === 47 || endIdx === 0) endIdx = 48;
  let difference = endIdx - startIdx;
  let height = difference * 50;
  let startY = startIdx * 50;
  let xDefault = days.indexOf(data.day) * 120;
  console.log({ data });
  return (
    <Rnd
      style={{
        position: 'relative',
        zIndex: invisible ? '-1' : '5',
        opacity: invisible ? '0' : '1',
      }}
      className={`rnd-item session recurring-${false}`}
      disableDragging={true}
      bounds='parent'
      enableResizing='false'
      default={{
        x: xDefault,
        y: startY,
        width: 120,
        height: `${height}px`,
      }}
    >
      <Link className='link' to={`/coachportal/manage/${data.id}`}>
        <Image
          name='client-profile'
          alt="client's profile"
          src={`/api/image/user/profilePic/${data.client}`}
        />
      </Link>
    </Rnd>
  );
};

export default Session;
