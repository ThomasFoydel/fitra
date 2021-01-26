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
    id,
    value,
    page,
    type,
    tags,
    res,
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
          bio: user.bio,
          type: user.userType,
          name: user.name,
          displayEmail: user.displayEmail,
          coverPic: user.coverPic,
          profilePic: user.profilePic,
          tags: user.tags,
          token,
        },
        settings: user.settings,
        messages: user.messages,
      };
    case 'LOGOUT':
      localStorage.removeItem('fitr-token');
      if (window.FB) window.FB.logout();
      return {
        ...state,
        isLoggedIn: false,
        showAuth: false,
        user: { name: '', displayEmail: '', userType: 'client' },
      };
    case 'CHANGE_PIC':
      let newPic = kind === 'coverPic' ? coverPic : profilePic;
      return {
        ...state,
        user: { ...state.user, [kind]: newPic },
      };
    case 'NEW_MESSAGE':
      let copy = { ...state.messages };
      let other = message.participants.filter((p) => p !== state.user.id)[0];
      let thread = copy[other];
      let updatedThread = thread ? [...thread, message] : [message];
      let updatedMessages = { ...copy, [other]: updatedThread };
      return { ...state, messages: updatedMessages };
    case 'CHANGE_SETTINGS':
      return { ...state, settings: { ...state.settings, [type]: value } };
    case 'CHANGE_SETTING':
      return { ...state, settings: { ...state.settings, [id]: value } };
    case 'TOGGLE_AUTH':
      return { ...state, showAuth: !state.showAuth };
    case 'CHANGE_AUTH_PAGE':
      return { ...state, authPage: page };
    case 'CHANGE_AUTH_TYPE':
      return { ...state, authType: type };
    case 'CHANGE_TAGS':
      return { ...state, user: { ...state.user, tags } };
    case 'EDIT_PROFILE':
      return { ...state, user: { ...state.user, ...res } };
    default:
      console.log('REDUCER ERROR: action: ', action);
      return { ...state };
  }
}

export default function Store(props) {
  const stateHook = React.useReducer(reducer, {
    isLoggedIn: false,
    showAuth: false,
    authPage: 'register',
    authType: 'client',
    user: { name: '', displayEmail: '', type: 'client', token: null, id: null },
    messages: {},
    settings: { darkmode: false, rate: '30', currency: 'USD' },
  });

  return <CTX.Provider value={stateHook}>{props.children}</CTX.Provider>;
}
