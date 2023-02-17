import React from 'react'
import PropTypes from 'prop-types'
import './SearchBar.scss'

const SearchBar = ({ props: { search, setSearch, queryType, setQueryType } }) => {
  const handleInput = ({ target: { value } }) => setSearch(value)
  const handleType = ({ target: { value } }) => setQueryType(value)
  return (
    <div className="searchbar">
      <input
        type="text"
        value={search}
        placeholder="search..."
        onChange={handleInput}
        className="searchbar-input"
      />
      <select value={queryType} className="querytype-selector" onChange={handleType}>
        <option value="tags">tags</option>
        <option value="name">name</option>
      </select>
    </div>
  )
}

SearchBar.propTypes = {
  props: PropTypes.shape({
    search: PropTypes.string.isRequired,
    setSearch: PropTypes.func.isRequired,
    queryType: PropTypes.string.isRequired,
    setQueryType: PropTypes.func.isRequired,
  }),
}

export default SearchBar
