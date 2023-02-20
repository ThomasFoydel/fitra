import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { config, animated, useTransition } from 'react-spring'
import SearchBar from 'Components/SearchBar/SearchBar'
import TrainerCard from './TrainerCard'
import './Trainers.scss'

const suggestionTags = ['mma', 'yoga', 'diet', 'pilates', 'boxing', 'cardio', 'calisthenics']

const Trainers = () => {
  const [currentTrainers, setCurrentTrainers] = useState([])
  const [queryType, setQueryType] = useState('tags')
  const [search, setSearch] = useState('')

  useEffect(() => {
    let subscribed = true
    if (queryType && search)
      axios
        .get(`/api/client/search?type=${queryType}&search=${search}`)
        .then(({ data: { trainers } }) => subscribed && setCurrentTrainers(trainers))
    return () => (subscribed = false)
  }, [search, queryType])

  const tagSearch = (tag) => {
    setQueryType('tags')
    setSearch(tag)
  }

  const animatedTrainers = useTransition(currentTrainers, {
    trail: 300,
    config: config.molasses,
    from: { opacity: '0', height: '0rem', transform: 'translateY(-20px)' },
    enter: { opacity: '1', height: '22rem', transform: 'translateY(0px)' },
    leave: { opacity: '0', height: '0rem', transform: 'translateY(0px)' },
  })

  return (
    <div className="trainers">
      <div className="top-section">
        <SearchBar props={{ search, setSearch, queryType, setQueryType }} />
        <div className="suggestion-tags">
          {queryType === 'tags' &&
            suggestionTags.map((tag) => (
              <button
                key={tag}
                className={`suggestion-tag ${search === tag ? 'current' : ''}`}
                onClick={() => tagSearch(tag)}
              >
                {tag}
              </button>
            ))}
        </div>
      </div>
      <div className="trainers-container">
        {animatedTrainers((style, trainer, key) => (
          <animated.div style={style} key={key}>
            <TrainerCard props={{ trainer, tagSearch }} />
          </animated.div>
        ))}
      </div>
    </div>
  )
}

export default Trainers
