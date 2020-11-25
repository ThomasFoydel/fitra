import React, { useState } from 'react';
import loadingGif from 'imgs/loading/loading.gif';
import defaultProfile from 'imgs/default/profile.jpg';

const Image = ({ name, src }) => {
  let [loading, setLoading] = useState(true);
  let [err, setErr] = useState(false);
  if (err) src = defaultProfile;
  return (
    <img
      className={name}
      src={loading ? loadingGif : src}
      onError={(err) => setErr(true)}
      onLoad={(e) => {
        setTimeout(() => {
          setLoading(false);
        }, 200);
      }}
    />
  );
};

export default Image;
