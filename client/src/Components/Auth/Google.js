import React from 'react';
import { GoogleLogin } from 'react-google-login';

const Google = ({ responseGoogle }) => {
  return (
    <GoogleLogin
      clientId={`${process.env.GOOGLE_ID}`}
      onSuccess={responseGoogle}
      onFailure={responseGoogle}
      cookiePolicy={'single_host_origin'}
      render={(renderProps) => (
        <button
          onClick={renderProps.onClick}
          disabled={renderProps.disabled}
          className='google-btn'
        >
          <i className='fab fa-google' />
          <span>Sign In with Google</span>
        </button>
      )}
    ></GoogleLogin>
  );
};

export default Google;
