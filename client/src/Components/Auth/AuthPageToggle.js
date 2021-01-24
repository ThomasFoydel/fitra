import React, { useContext } from 'react';
import { CTX } from 'context/Store';

const AuthPageToggle = () => {
  const [appState, updateState] = useContext(CTX);
  let { authType } = appState;
  let trainer = authType === 'trainer';
  let text = trainer ? 'User?' : 'Trainer?';
  let type = trainer ? 'client' : 'trainer';

  const toggle = () =>
    updateState({ type: 'CHANGE_AUTH_TYPE', payload: { type } });

  return (
    <button onClick={toggle} className='auth-pagetoggle'>
      {text}
    </button>
  );
};

export default AuthPageToggle;
