import React from 'react';
import Review from './Review';

import { useTransition, animated, config } from 'react-spring';

const ReviewSlide = ({ reviews }) => {
  const animatedReviews = useTransition(reviews, (item) => item._id, {
    from: { opacity: '0', transform: 'translateY(-10px)' },
    enter: { opacity: '1', transform: 'translateY(0px)' },
    leave: { opacity: '0', transform: 'translateY(-10px)' },
    trail: 200,
    config: config.wobbly,
  });

  return (
    <div className='review-slide'>
      {animatedReviews.map(({ item, props, key }) => (
        <animated.div style={props} key={key}>
          <Review review={item} />
        </animated.div>
      ))}
    </div>
  );
};

export default ReviewSlide;
