import React from 'react';
import FacebookLogin from 'react-facebook-login';

const Facebook = ({ callback }) => {
  console.log('facebook component');
  console.log(process.env.FACEBOOK_ID);
  return (
    <FacebookLogin
      appId={`${process.env.FACEBOOK_ID}`}
      callback={callback}
      autoLoad={false}
    />
  );
};

export default Facebook;
