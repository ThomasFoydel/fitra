import React, { useState, useEffect } from 'react';
import loadingGif from 'imgs/loading/spin.gif';
import defaultProfile from 'imgs/default/profile.jpg';
 
const Image = ({ name, src, style, alt }) => {
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState(src || defaultProfile);
  const [err, setErr] = useState(false);

  useEffect(()=> {
    if (err && source !== defaultProfile) source = defaultProfile;
  }, [err])

  useEffect(()=> {
    if (src && source !== src) setSource(src)
  }, [src])

  return (
    <img
      style={style}
      className={name}
      alt={alt}
      src={loading ? loadingGif : source}
      onError={(err) => {
        setErr(true);
      }}
      onLoad={(e) => {
        setTimeout(() => {
          setLoading(false);
        }, 200);
      }}
    />
  );
};

export default Image;
