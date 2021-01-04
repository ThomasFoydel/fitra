import React from 'react';
import stars from 'imgs/icons/stars.png';
import { Link } from 'react-router-dom';
import Image from 'Components/Image/Image';

const Review = ({ review: { rating, comment, client } }) => {
  return (
    <div className='review'>
      <Link to={`/user/${client}`}>
        <Image
          src={`/api/image/user/profilePic/${client}`}
          name='review-profile-pic'
        />
      </Link>
      <div className='star-rating'>
        <div
          className='rating-background'
          style={{
            width: `${Math.floor(rating * 20)}%`,
            background: `linear-gradient(
            to right, rgb(245, 220, 0), rgb(255, ${Math.floor(
              255 - rating * 51
            )}, 0)
          )`,
          }}
        />
        <img className='stars' src={stars} alt='star rating' />
      </div>
      <div className='rating'>{rating}</div>
      <div className='comment'>{comment}</div>
    </div>
  );
};

export default Review;
