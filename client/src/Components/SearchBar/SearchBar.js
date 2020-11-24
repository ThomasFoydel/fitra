import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SearchBar.scss';
const SearchBar = ({ change }) => {
  const [search, setSearch] = useState('');
  const [err, setErr] = useState('');
  const [queryType, setQueryType] = useState('tags');
  const handleChange = ({ target: { value } }) => {
    setSearch(value);
  };
  useEffect(() => {
    axios
      .post(`/api/client/search/${queryType}`, { search })
      .then(({ data: { result, err } }) => {
        // console.log({ result });
        if (err) return setErr(err);
        change(result);
      });
  }, [search, queryType]);
  return (
    <div className='searchbar'>
      <input
        className='searchbar-input'
        placeholder='search...'
        type='text'
        onChange={handleChange}
      />
      <select
        className='querytype-selector'
        value={queryType}
        onChange={({ target: { value } }) => setQueryType(value)}
      >
        <option value='tags'>tags</option>
        <option value='name'>name</option>
      </select>
    </div>
  );
};

export default SearchBar;
