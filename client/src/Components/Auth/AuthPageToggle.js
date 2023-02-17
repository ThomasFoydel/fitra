import React, { useContext } from 'react'
import { CTX } from 'context/Store'

const AuthPageToggle = () => {
  const [{ authType }, updateState] = useContext(CTX)
  const trainer = authType === 'trainer'
  const text = trainer ? 'User?' : 'Trainer?'
  const type = trainer ? 'client' : 'trainer'

  const toggle = () => updateState({ type: 'CHANGE_AUTH_TYPE', payload: { type } })

  return (
    <button onClick={toggle} className="auth-pagetoggle">
      {text}
    </button>
  )
}

export default AuthPageToggle
