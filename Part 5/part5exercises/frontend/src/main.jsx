import ReactDOM from 'react-dom/client'
import React from 'react'
import ThemeProvider from './contexts/ThemeContext'
import App from './App'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import NewBlogPage from './pages/NewBlogPage'
import IndividualBlogPage from './pages/IndividualBlogPage'
import './index.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path='/' element={<App />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/addblog' element={<NewBlogPage />} />
          <Route path='/single' element={<IndividualBlogPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  </React.StrictMode>
)
