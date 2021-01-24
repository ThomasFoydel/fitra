import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import SearchBar from 'Components/SearchBar/SearchBar';
import './Trainers.scss';
import TrainerCard from './TrainerCard';
import { config, animated, useTransition } from 'react-spring';

const suggestionTags = [
  'mma',
  'yoga',
  'diet',
  'pilates',
  'boxing',
  'cardio',
  'calisthenics',
];

const Trainers = () => {
  const [currentTrainers, setCurrentTrainers] = useState([]);
  const [search, setSearch] = useState('');
  const [err, setErr] = useState('');
  const [queryType, setQueryType] = useState('tags');

  useEffect(() => {
    if (queryType && search)
      axios
        .post(`/api/client/search/${queryType}`, { search })
        .then(({ data: { result, err } }) => {
          if (err) return setErr(err);
          else setCurrentTrainers(result);
        });
  }, [search, queryType]);

  const tagSearch = (tag) => {
    setQueryType('tags');
    setSearch(tag);
  };

  const didMountRef = useRef(false);
  useEffect(() => {
    let subscribed = true;
    if (didMountRef.current) {
      setTimeout(() => {
        if (subscribed) setErr('');
      }, 2700);
    } else didMountRef.current = true;
    return () => (subscribed = false);
  }, [err]);

  const animation = useTransition(currentTrainers, (item) => item._id, {
    from: { opacity: '0', height: '0rem', transform: 'translateY(-20px)' },
    enter: { opacity: '1', height: '22rem', transform: 'translateY(0px)' },
    leave: {
      opacity: '0',
      height: '0rem',
      transform: 'translateY(0px)',
    },
    trail: 300,
    config: config.molasses,
  });

  return (
    <div className='trainers'>
      <div className='background' />
      <div className='overlay' />
      <div className='top-section'>
        <SearchBar props={{ search, setSearch, queryType, setQueryType }} />
        <div className='suggestion-tags'>
          {queryType === 'tags' &&
            suggestionTags.map((tag) => (
              <div
                key={tag}
                className={`suggestion-tag ${search === tag ? 'current' : ''}`}
                onClick={() => tagSearch(tag)}
              >
                {tag}
              </div>
            ))}
        </div>
      </div>
      <div className='trainers-container'>
        {animation.map(({ item, props, key }) => (
          <animated.div
            style={props}
            className='trainer-animation-container'
            key={key}
          >
            <TrainerCard trainer={item} tagSearch={tagSearch} />
          </animated.div>
        ))}
        <div className='err'>{err}</div>
      </div>
    </div>
  );
};

export default Trainers;
