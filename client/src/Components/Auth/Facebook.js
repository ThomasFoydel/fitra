import React from 'react';
import FacebookLogin from 'react-facebook-login';
import PropTypes from 'prop-types';

const Facebook = ({ props: { callback } }) => {
  return (
    <FacebookLogin
      appId='720458158847477'
      callback={callback}
      autoLoad={false}
    />
  );
};

Facebook.propTypes = {
  props: PropTypes.shape({
    callback: PropTypes.func.isRequired,
  }),
};

export default Facebook;
