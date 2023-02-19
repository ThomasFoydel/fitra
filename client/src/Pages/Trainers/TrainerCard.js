import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSpring, animated, config } from 'react-spring'
import Image from 'Components/Image/Image'
import PropTypes from 'prop-types'

const TrainerCard = ({ props: { trainer, tagSearch } }) => {
  const { _id, coverPic, name, profilePic, bio, tags } = trainer
  const [hover, setHover] = useState(false)

  const scaleAnimation = useSpring({
    config: config.wobbly,
    transform: hover ? 'scale(1.05)' : 'scale(1)',
  })

  const backgroundAnimation = useSpring({
    config: config.wobbly,
    background: hover ? 'rgba(255, 255, 255, 0.98)' : 'rgba(255, 255, 255, 0.8)',
  })

  const sizeAnimation = useSpring({
    config: config.stiff,
    width: hover ? '11rem' : '8rem',
    height: hover ? '11rem' : '8rem',
  })

  const handleTag = ({ target }) => tagSearch(target.id)

  return (
    <div onMouseOver={() => setHover(true)} onMouseOut={() => setHover(false)}>
      <Link to={`/trainer/${_id}`} key={_id} className="link">
        <animated.div className="trainer-card" style={scaleAnimation}>
          <div className="left-section">
            <Image alt="trainer's cover" name="coverpic" src={`/api/image/${coverPic}`} />
            <div className="shadow" />
            <div className="name">{name}</div>
            <animated.div className="profile-container" style={sizeAnimation}>
              <Image name="profilepic" alt="trainer's profile" src={`/api/image/${profilePic}`} />
            </animated.div>
          </div>
          <animated.div className="right-section" style={backgroundAnimation}>
            <div className="bio">{bio}</div>
            <div className="tags">
              {tags.map((tag, i) => (
                <span key={tag} id={tag} className="tag" onClick={handleTag}>
                  #{tag}
                  {i < tags.length - 1 && tags.length > 1 && ', '}
                </span>
              ))}
            </div>
          </animated.div>
        </animated.div>
      </Link>
    </div>
  )
}

TrainerCard.propTypes = {
  props: PropTypes.shape({
    trainer: PropTypes.object.isRequired,
    tagSearch: PropTypes.func.isRequired,
  }),
}

export default TrainerCard
