import { createContext, useReducer } from 'react'

export const CTX = createContext()

export function reducer(state, action) {
  const { payload } = action
  const { id, res, tags, user, kind, page, type, value, token, message, coverPic, profilePic } =
    payload || {}
  switch (action.type) {
    case 'LOGIN':
      localStorage.setItem('fitr-token', token)
      return {
        ...state,
        isLoggedIn: true,
        messages: user.messages,
        settings: user.settings,
        user: {
          token,
          id: user.id,
          bio: user.bio,
          tags: user.tags,
          name: user.name,
          type: user.userType,
          coverPic: user.coverPic,
          profilePic: user.profilePic,
          displayEmail: user.displayEmail,
        },
      }
    case 'LOGOUT':
      localStorage.removeItem('fitr-token')
      if (window.FB) window.FB.logout()
      return {
        ...state,
        showAuth: false,
        isLoggedIn: false,
        user: { name: '', displayEmail: '', userType: 'client' },
      }
    case 'CHANGE_PIC':
      const newPic = kind === 'coverPic' ? coverPic : profilePic
      return {
        ...state,
        user: { ...state.user, [kind]: newPic },
      }
    case 'NEW_MESSAGE':
      const copy = { ...state.messages }
      const other = message.participants.filter((p) => p !== state.user.id)[0]
      const thread = copy[other]
      const updatedThread = thread ? [...thread, message] : [message]
      const updatedMessages = { ...copy, [other]: updatedThread }
      return { ...state, messages: updatedMessages }
    case 'CHANGE_SETTINGS':
      return { ...state, settings: { ...state.settings, [type]: value } }
    case 'CHANGE_SETTING':
      return { ...state, settings: { ...state.settings, [id]: value } }
    case 'TOGGLE_AUTH':
      return { ...state, showAuth: !state.showAuth }
    case 'CHANGE_AUTH_PAGE':
      return { ...state, authPage: page }
    case 'CHANGE_AUTH_TYPE':
      return { ...state, authType: type }
    case 'CHANGE_TAGS':
      return { ...state, user: { ...state.user, tags } }
    case 'EDIT_PROFILE':
      return { ...state, user: { ...state.user, ...res } }
    default:
      console.error('REDUCER ERROR: action: ', action)
      return { ...state }
  }
}

export default function Store(props) {
  const stateHook = useReducer(reducer, {
    messages: {},
    showAuth: false,
    isLoggedIn: false,
    authType: 'client',
    authPage: 'register',
    settings: { darkmode: false, rate: '30', currency: 'USD' },
    user: { name: '', displayEmail: '', type: 'client', token: null, id: null },
  })

  return <CTX.Provider value={stateHook}>{props.children}</CTX.Provider>
}
