import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'
import defaultProfile from 'imgs/default/profile.jpg'
import loadingGif from 'imgs/loading/spin.gif'

const Image = ({ name, src, style, alt, defaultImage }) => {
  const [loading, setLoading] = useState(true)
  const [source, setSource] = useState(src || defaultProfile)
  const [err, setErr] = useState(false)

  useEffect(() => {
    if (err) setSource(defaultProfile)
  }, [err])

  useEffect(() => {
    if (src) setSource(src)
    else setSource(defaultProfile)
  }, [src])

  const imgStyle = { background: 'white' }
  const styles = style ? { ...style, ...imgStyle } : imgStyle

  return (
    <img
      alt={alt}
      style={styles}
      className={name}
      onError={() => setErr(true)}
      src={loading ? loadingGif : source ? source : defaultImage}
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
