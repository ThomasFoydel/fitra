import React from 'react';
import FacebookLogin from 'react-facebook-login';

const Facebook = ({ callback }) => {
  return <FacebookLogin appId={process.env.FACEBOOK_ID} callback={callback} />;
};

export default Facebook;
