import React from 'react'
import { Link } from 'react-router-dom'
import Image from 'Components/Image/Image'
import stars from 'imgs/icons/stars.png'

const Review = ({ review: { rating, comment, client } }) => {
  const greenAmount = Math.floor(255 - (rating + 1) * 51)
  return (
    <div className="review">
      <Link to={`/user/${client}`}>
        <Image
          alt="client profile"
          name="review-profile-pic"
          src={`/api/image/user/profilePic/${client}`}
        />
      </Link>
      <div className="star-rating">
        <div
          className="rating-background"
          style={{
            width: `${Math.floor((rating + 1) * 20)}%`,
            background: `linear-gradient(to right, rgb(245, 220, 0), rgb(255, ${greenAmount}, 0))`,
          }}
        />
        <img className="stars" src={stars} alt={`${rating + 1} star rating`} />
      </div>
      <div className="rating">{rating + 1}</div>
      <div className="comment">{comment}</div>
    </div>
  )
}

export default Review
