import React from 'react'
import { Rnd } from 'react-rnd'
import { days, halfHours } from '../../../../util/util'
import Image from 'Components/Image/Image'
import { Link } from 'react-router-dom'

const Session = ({ props: { data, inCurrentWeek } }) => {
  const invisible = !inCurrentWeek
  let endIdx = halfHours.indexOf(data.end)
  const startIdx = halfHours.indexOf(data.start)
  if (startIdx === 47 || endIdx === 0) endIdx = 48
  const xDefault = days.indexOf(data.day) * 120
  const difference = endIdx - startIdx
  const height = difference * 50
  const startY = startIdx * 50

  return (
    <Rnd
      bounds="parent"
      enableResizing="false"
      disableDragging={true}
      default={{
        y: startY,
        width: 120,
        x: xDefault,
        height: `${height}px`,
      }}
      className={`rnd-item session recurring-${false}`}
      style={{ zIndex: invisible ? '-1' : '5', opacity: invisible ? '0' : '1' }}
    >
      <Link className="link" to={`/coachportal/manage/${data.id}`}>
        <Image
          name="client-profile"
          alt="client's profile"
          src={`/api/image/user/profilePic/${data.client}`}
        />
      </Link>
    </Rnd>
  )
}

export default Session
