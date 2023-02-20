import React from 'react'
import ReactDOM from 'react-dom/client'
import Store from 'context/Store'
import App from './App'

const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
  <React.StrictMode>
    <Store>
      <App />
    </Store>
  </React.StrictMode>
)
