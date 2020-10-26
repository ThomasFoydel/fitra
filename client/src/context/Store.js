import React from 'react';

const CTX = React.createContext();
export { CTX };

export function reducer(state, action) {
  let { payload } = action;
  let {
    user,
    token,
    profilePic,
    coverPic,
    kind,
    message,
    darkmode,
    page,
    type,
  } = payload || {};
  console.log('action: ', action);
  switch (action.type) {
    case 'LOGIN':
      localStorage.setItem('fitr-token', token);
      return {
        ...state,
        isLoggedIn: true,
        user: {
          id: user.id,
          type: user.userType,
          name: user.name,
          email: user.email,
          coverPic: user.coverPic,
          profilePic: user.profilePic,
          token,
        },
        settings: user.settings,
        messages: user.messages,
      };
    case 'LOGOUT':
      localStorage.removeItem('fitr-token');
      return {
        ...state,
        isLoggedIn: false,
        user: { name: '', email: '', userType: 'client' },
      };
    case 'CHANGE_PIC':
      let newPic = kind === 'coverPic' ? coverPic : profilePic;
      return {
        ...state,
        user: { ...state.user, [kind]: newPic },
      };
    case 'NEW_MESSAGE':
      console.log('NEW_MESSAGE: ', message);
      let copy = { ...state.messages };
      let other = message.participants.filter((p) => p !== state.user.id)[0];
      let thread = copy[other];
      let updatedThread = [...thread, message];
      let updatedMessages = { ...copy, [other]: updatedThread };
      return { ...state, messages: updatedMessages };
    case 'TOGGLE_DARKMODE':
      return { ...state, settings: { ...state.settings, darkmode } };
    case 'TOGGLE_AUTH':
      return { ...state, showAuth: !state.showAuth };
    case 'CHANGE_AUTH_PAGE':
      return { ...state, authPage: page };
    case 'CHANGE_AUTH_TYPE':
      return { ...state, authType: type };
    default:
      console.log('REDUCER ERROR: action: ', action);
      // throw Error('reducer error');
      return { ...state };
  }
}

export default function Store(props) {
  const stateHook = React.useReducer(reducer, {
    isLoggedIn: false,
    showAuth: false,
    authPage: 'register',
    authType: 'client',
    user: { name: '', email: '', type: 'client', token: null, id: null },
    messages: {},
    settings: { darkmode: false },
  });

  return <CTX.Provider value={stateHook}>{props.children}</CTX.Provider>;
}
