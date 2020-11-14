import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import SearchBar from 'Components/SearchBar/SearchBar';
import './Trainers.scss';

const Trainers = () => {
  const [currentTrainers, setCurrentTrainers] = useState([]);
  useEffect(() => {
    let subscribed = true;
    axios.get('/api/client/trainers').then(({ data: { trainers, err } }) => {
      if (subscribed) {
        setCurrentTrainers(trainers);
      }
    });
    return () => {
      subscribed = false;
    };
  }, []);
  return (
    <div className='trainers'>
      <div className='background' />
      <div className='overlay' />
      <h1 className='header center'>Trainers</h1>
      <div className='trainers-container'>
        <SearchBar />
        {currentTrainers.map((trainer) => (
          <Link
            to={`/trainer/${trainer._id}`}
            key={trainer._id}
            style={{ textDecoration: 'inherit' }}
          >
            <div className='trainer'>
              <div className='center name'>{trainer.name}</div>
              <img
                className='coverpic'
                src={`/api/image/${trainer.coverPic}`}
              />
              <img
                className='profilepic'
                src={`/api/image/${trainer.profilePic}`}
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Trainers;
