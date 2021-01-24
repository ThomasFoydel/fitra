import React from 'react';
import './SearchBar.scss';
import PropTypes from 'prop-types';

const SearchBar = ({
  props: { search, setSearch, queryType, setQueryType },
}) => {
  const handleChange = ({ target: { value } }) => {
    setSearch(value);
  };

  return (
    <div className='searchbar'>
      <input
        className='searchbar-input'
        placeholder='search...'
        type='text'
        onChange={handleChange}
        value={search}
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

SearchBar.propTypes = {
  props: PropTypes.shape({
    search: PropTypes.string.isRequired,
    setSearch: PropTypes.func.isRequired,
    queryType: PropTypes.string.isRequired,
    setQueryType: PropTypes.func.isRequired,
  }),
};

export default SearchBar;
