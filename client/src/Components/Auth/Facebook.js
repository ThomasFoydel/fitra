import React from 'react';
import FacebookLogin from 'react-facebook-login';

const Facebook = ({ callback }) => {
  return (
    <FacebookLogin
      appId='720458158847477'
      callback={callback}
      autoLoad={false}
    />
  );
};

export default Facebook;
