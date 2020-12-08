import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SearchBar from 'Components/SearchBar/SearchBar';
import './Trainers.scss';
import TrainerCard from './TrainerCard';

const suggestionTags = [
  'mma',
  'yoga',
  'diet',
  'pilates',
  'boxing',
  'cardio',
  'calistehnics',
];

const Trainers = () => {
  const [currentTrainers, setCurrentTrainers] = useState([]);
  const [firstLoad, setFirstLoad] = useState(true);
  const [search, setSearch] = useState('');
  const [err, setErr] = useState('');
  const [queryType, setQueryType] = useState('tags');

  useEffect(() => {
    if (queryType && search)
      axios
        .post(`/api/client/search/${queryType}`, { search })
        .then(({ data: { result, err } }) => {
          if (err) return setErr(err);
          setCurrentTrainers(result);
        });
  }, [search, queryType]);

  const tagSearch = (tag) => {
    setQueryType('tags');
    setSearch(tag);
  };

  return (
    <div className='trainers'>
      <div className='background' />
      <div className='overlay' />
      {/* <h1 className='header center'>Trainers</h1> */}
      <SearchBar props={{ search, setSearch, queryType, setQueryType }} />
      <div className='suggestion-tags'>
        {suggestionTags.map((tag) => (
          <div
            key={tag}
            className='suggestion-tag'
            onClick={() => tagSearch(tag)}
          >
            {tag}
          </div>
        ))}
      </div>
      <div className='trainers-container'>
        {currentTrainers.map((trainer) => (
          <TrainerCard
            key={trainer._id}
            trainer={trainer}
            tagSearch={tagSearch}
          />
        ))}
      </div>
    </div>
  );
};

export default Trainers;
