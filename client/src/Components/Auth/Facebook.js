import React from 'react';
import FacebookLogin from 'react-facebook-login';

const Facebook = ({ callback }) => {
  return (
    <FacebookLogin
      appId={`${process.env.FACEBOOK_ID}`}
      callback={callback}
      render={(renderProps) => (
        <button onClick={renderProps.onClick} className='fb-btn'>
          <i className='fab fa-facebook' />
          <span className='ml-4'>Sign In with Facebook</span>
        </button>
      )}
    />
  );
};

export default Facebook;
