import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SearchBar.scss';
const SearchBar = ({ change }) => {
  const [search, setSearch] = useState('');

  const handleChange = ({ target: { value } }) => {
    setSearch(value);
  };
  useEffect(() => {
    axios.post('/api/search/', { search }).then((result) => {
      console.log({ result });
    });
  }, [search]);
  return (
    <div>
      <input
        className='searchbar'
        placeholder='search...'
        type='text'
        onChange={handleChange}
      />
    </div>
  );
};

export default SearchBar;
