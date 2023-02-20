import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'
import defaultProfile from 'imgs/default/profile.jpg'
import loadingGif from 'imgs/loading/spin.gif'

const Image = ({ name, src, style, alt, defaultImage }) => {
  const [loading, setLoading] = useState(true)
  const [errored, setErrored] = useState(false)
  const [source, setSource] = useState(src || defaultImage || defaultProfile)

  useEffect(() => {
    if (errored) setSource(defaultImage || defaultProfile)
  }, [errored])

  useEffect(() => {
    if (src && !src.includes('undefined') && src !== source) setSource(src)
  }, [src])

  const imgStyle = { background: 'white' }

  const styles = style ? { ...style, ...imgStyle } : imgStyle

  return (
    <img
      alt={alt}
      style={styles}
      className={name}
      onError={() => setErrored(true)}
      src={loading ? loadingGif : source}
      onLoad={() => setTimeout(() => setLoading(false), 200)}
    />
  )
}

Image.propTypes = {
  style: PropTypes.object,
  defaultImage: PropTypes.string,
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
}

export default Image
