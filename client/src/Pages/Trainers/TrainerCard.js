import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSpring, animated, config } from 'react-spring';

const TrainerCard = ({ trainer, tagSearch }) => {
  const [hover, setHover] = useState(false);

  const animation = useSpring({
    transform: hover ? 'scale(1.03)' : 'scale(1)',
    background: hover
      ? 'rgba(255, 255, 255, 0.975)'
      : 'rgba(255, 255, 255, 0.575)',
    config: config.wobbly,
  });

  const handleTag = (e) => {
    e.preventDefault();
    const {
      target: { id },
    } = e;
    tagSearch(id);
  };

  return (
    <div onMouseOver={() => setHover(true)} onMouseOut={() => setHover(false)}>
      <Link
        to={`/trainer/${trainer._id}`}
        key={trainer._id}
        style={{ textDecoration: 'inherit' }}
      >
        <animated.div className='trainer-card' style={animation}>
          <div className='left-section'>
            <img className='coverpic' src={`/api/image/${trainer.coverPic}`} />
            <div className='shadow' />
            <div className='name'>{trainer.name}</div>
            <div className='profile-container'>
              <img
                className='profilepic'
                src={`/api/image/${trainer.profilePic}`}
              />
            </div>
          </div>
          <div className='right-section'>
            <div className='bio'>{trainer.bio}</div>
            <div className='tags'>
              {trainer.tags.map((tag, i) => (
                <span key={tag} id={tag} className='tag' onClick={handleTag}>
                  # {tag}
                  {i < trainer.tags.length - 1 &&
                    trainer.tags.length > 1 &&
                    ', '}
                </span>
              ))}
            </div>
          </div>
        </animated.div>
      </Link>
    </div>
  );
};

export default TrainerCard;
