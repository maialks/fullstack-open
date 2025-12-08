import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'

import './index.css'
import ThemeProvider from './contexts/ThemeContext'
import App from './App'
import store from './app/store'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
)
