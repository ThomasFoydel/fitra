import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
      <input type='text' onChange={handleChange} />
    </div>
  );
};

export default SearchBar;
