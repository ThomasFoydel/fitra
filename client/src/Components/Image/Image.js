import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import loadingGif from 'imgs/loading/spin.gif';
import defaultProfile from 'imgs/default/profile.jpg';

const Image = ({ name, src, style, alt }) => {
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState(src || defaultProfile);
  const [err, setErr] = useState(false);

  useEffect(() => {
    if (err) setSource(defaultProfile);
  }, [err]);

  useEffect(() => {
    if (src) setSource(src);
    else setSource(defaultProfile);
  }, [src]);

  return (
    <img
      style={style}
      className={name}
      alt={alt}
      src={loading ? loadingGif : source}
      onError={(err) => {
        console.log({ err });
        setErr(true);
      }}
      onLoad={() => {
        setTimeout(() => {
          setLoading(false);
        }, 200);
      }}
    />
  );
};

Image.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  style: PropTypes.object,
};

export default Image;
