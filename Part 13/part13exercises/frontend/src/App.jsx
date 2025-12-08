// src/App.jsx
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'

import Home from './features/blogs/Home'
import Login from './features/auth/LoginPage'
import Register from './features/users/RegisterPage'
import AddBlog from './features/blogs/AddBlogPage'
import BlogPage from './features/blogs/BlogPage'
import UserPage from './features/users/UserPage'
import { setUser } from './features/auth/authSlice'
import ProtectedRoute from './components/ProtectedRoute'
import UsersList from './features/users/UsersList'

export default function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    const token = window.localStorage.getItem('loggedBlogAppUser')
    if (token) {
      const { username, id: userId } = jwtDecode(token)
      dispatch(setUser({ token, username, userId }))
    } else {
      dispatch(setUser({ token: null, username: null, userId: null }))
    }
  }, [dispatch])

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route
          path='/login'
          element={
            <ProtectedRoute
              message={'Please log out before trying to acess this page'}
              requireAuth={false}
            >
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute
              message={'Please log out before trying to acess this page'}
              requireAuth={false}
            >
              <Register />
            </ProtectedRoute>
          }
        />
        <Route path='/blogs/:id' element={<BlogPage />} />
        <Route
          path='/add'
          element={
            <ProtectedRoute message={'Only authenticated users can add blogs'}>
              <AddBlog />
            </ProtectedRoute>
          }
        />
        <Route
          path='/users'
          element={
            <ProtectedRoute>
              <UsersList />
            </ProtectedRoute>
          }
        />
        <Route
          path='/users/:id'
          element={
            <ProtectedRoute>
              <UserPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  )
}
