import React from 'react'
import Review from './Review'

import { useTransition, animated, config } from 'react-spring'

const ReviewSlide = ({ reviews }) => {
  const animatedReviews = useTransition(reviews, {
    trail: 200,
    config: config.wobbly,
    from: { opacity: '0', transform: 'translateY(-10px)' },
    enter: { opacity: '1', transform: 'translateY(0px)' },
    leave: { opacity: '0', transform: 'translateY(-10px)' },
  })

  return (
    <div className="review-slide">
      {animatedReviews((style, review) => (
        <animated.div style={style} key={review._id}>
          <Review review={review} />
        </animated.div>
      ))}
    </div>
  )
}

export default ReviewSlide
