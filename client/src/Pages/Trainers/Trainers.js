import axios from 'axios'
import React, { useState, useEffect, useRef } from 'react'
import { config, animated, useTransition } from 'react-spring'
import SearchBar from 'Components/SearchBar/SearchBar'
import TrainerCard from './TrainerCard'
import './Trainers.scss'

const suggestionTags = ['mma', 'yoga', 'diet', 'pilates', 'boxing', 'cardio', 'calisthenics']

const Trainers = () => {
  const [currentTrainers, setCurrentTrainers] = useState([])
  const [search, setSearch] = useState('')
  const [err, setErr] = useState('')
  const [queryType, setQueryType] = useState('tags')

  useEffect(() => {
    if (queryType && search)
      axios
        .get(`/api/client/search?type=${queryType}&search=${search}`)
        .then(({ data: { result, err } }) => {
          if (err) return setErr(err)
          else setCurrentTrainers(result)
        })
  }, [search, queryType])

  const tagSearch = (tag) => {
    setQueryType('tags')
    setSearch(tag)
  }

  const didMountRef = useRef(false)

  useEffect(() => {
    let subscribed = true
    if (didMountRef.current) {
      setTimeout(() => {
        if (subscribed) setErr('')
      }, 2700)
    } else didMountRef.current = true
    return () => (subscribed = false)
  }, [err])

  const trainerCards = useTransition(currentTrainers, {
    trail: 300,
    config: config.molasses,
    from: { opacity: '0', height: '0rem', transform: 'translateY(-20px)' },
    enter: { opacity: '1', height: '22rem', transform: 'translateY(0px)' },
    leave: { opacity: '0', height: '0rem', transform: 'translateY(0px)' },
  })

  return (
    <div className="trainers">
      <div className="background" />
      <div className="overlay" />
      <div className="top-section">
        <SearchBar props={{ search, setSearch, queryType, setQueryType }} />
        <div className="suggestion-tags">
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
      <div className="trainers-container">
        {trainerCards((style, item) => (
          <animated.div style={style}>
            <TrainerCard props={{ trainer: item, tagSearch }} />
          </animated.div>
        ))}
        <div className="err">{err}</div>
      </div>
    </div>
  )
}

export default Trainers
