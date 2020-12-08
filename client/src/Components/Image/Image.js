import React, { useState } from 'react';
import loadingGif from 'imgs/loading/loading.gif';
import defaultProfile from 'imgs/default/profile.jpg';

const Image = ({ name, src, style, alt }) => {
  const [loading, setLoading] = useState(true);
  let [err, setErr] = useState(false);
  if (err) src = defaultProfile;
  return (
    <img
      style={style}
      className={name}
      alt={alt}
      src={loading ? loadingGif : src}
      onError={(err) => {
        console.log('image error: ', err);
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
