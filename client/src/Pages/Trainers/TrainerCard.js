import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSpring, animated, config } from 'react-spring';
import Image from 'Components/Image/Image';
import PropTypes from 'prop-types';

const TrainerCard = ({ props: { trainer, tagSearch } }) => {
  const [hover, setHover] = useState(false);

  const animation = useSpring({
    transform: hover ? 'scale(1.03)' : 'scale(1)',
    background: hover
      ? 'rgba(255, 255, 255, 0.98)'
      : 'rgba(255, 255, 255, 0.8)',
    config: config.wobbly,
  });

  const handleTag = (e) => {
    e.preventDefault();
    const {
      target: { id },
    } = e;
    tagSearch(id);
  };

  let { _id, coverPic, name, profilePic, bio, tags } = trainer;

  return (
    <div
      className='card-container'
      onMouseOver={() => setHover(true)}
      onMouseOut={() => setHover(false)}
    >
      <Link
        to={`/trainer/${_id}`}
        key={_id}
        style={{ textDecoration: 'inherit' }}
      >
        <animated.div className='trainer-card' style={animation}>
          <div className='left-section'>
            <Image
              alt="trainer's cover"
              name='coverpic'
              src={`/api/image/${coverPic}`}
            />
            <div className='shadow' />
            <div className='name'>{name}</div>
            <div className='profile-container'>
              <Image
                alt="trainer's profile"
                name='profilepic'
                src={`/api/image/${profilePic}`}
              />
            </div>
          </div>
          <div className='right-section'>
            <div className='bio'>{bio}</div>
            <div className='tags'>
              {tags.map((tag, i) => (
                <span key={tag} id={tag} className='tag' onClick={handleTag}>
                  #{tag}
                  {i < tags.length - 1 && tags.length > 1 && ', '}
                </span>
              ))}
            </div>
          </div>
        </animated.div>
      </Link>
    </div>
  );
};

TrainerCard.propTypes = {
  props: PropTypes.shape({
    trainer: PropTypes.object.isRequired,
    tagSearch: PropTypes.func.isRequired,
  }),
};

export default TrainerCard;
