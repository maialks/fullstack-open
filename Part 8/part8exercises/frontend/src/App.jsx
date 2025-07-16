import { useMutation, useQuery } from '@apollo/client'
import Navbar from './components/Navbar'
import useField from './hooks/useField'
import { LOGIN, GET_USER_DATA } from './queries'
import { useState, useEffect } from 'react'
import { useAuth } from './context/AuthContext'
import LoadingSpinner from './components/LoadingSpinner'
import Notification from './components/Notification'
import { useNotification } from './context/NotificationContext'

const LoginForm = ({ login }) => {
  const username = useField('text')
  const password = useField('password')

  const inputStyles = {
    container: {
      marginLeft: 15,
      color: '#e0e0e0',
      backgroundColor: '#121212',
      padding: 20,
      fontFamily: 'Arial, sans-serif',
    },
    form: {
      maxWidth: 600,
      marginTop: 20,
    },
    label: {
      display: 'block',
      marginBottom: 6,
      fontWeight: 'bold',
    },
    input: {
      backgroundColor: '#1e1e1e',
      color: '#e0e0e0',
      border: '1px solid #333',
      padding: '8px',
      borderRadius: 4,
      width: '100%',
      boxSizing: 'border-box',
      marginBottom: 16,
    },
    button: {
      padding: '8px 16px',
      backgroundColor: '#272727',
      color: '#fff',
      border: 'none',
      borderRadius: 4,
      cursor: 'pointer',
      marginTop: 8,
      marginRight: 8,
    },
    genresList: {
      marginTop: 12,
      color: '#ccc',
    },
  }

  const submit = (e) => {
    e.preventDefault()
    login({
      variables: {
        username: username.inputProps.value,
        password: password.inputProps.value,
      },
    })

    username.setValue('')
    password.setValue('')
  }

  return (
    <div style={inputStyles.container}>
      <h2>Login</h2>
      <form onSubmit={submit} style={inputStyles.form}>
        <label style={inputStyles.label}>Username</label>
        <input {...username.inputProps} style={inputStyles.input} />

        <label style={inputStyles.label}>Password</label>
        <input {...password.inputProps} style={inputStyles.input} />

        <button type='submit' style={inputStyles.button}>
          Login
        </button>
      </form>
    </div>
  )
}

const App = () => {
  const { setToken } = useAuth()
  const { loading, data, refetch } = useQuery(GET_USER_DATA)
  const { showNotification } = useNotification()

  const [login, result] = useMutation(LOGIN, {
    onError: async (error) => {
      showNotification(error.message)
      console.log(error.message)
    },
  })

  useEffect(() => {
    if (!result.data) return
    const token = result.data.login.value
    setToken(token)
    localStorage.setItem('booksapp-user-token', token)

    refetch()
  }, [result.data])

  if (loading) {
    return (
      <div>
        <LoadingSpinner />
      </div>
    )
  }

  const user = data.me
  return (
    <div>
      <Navbar />
      <Notification />
      {!user && <LoginForm login={login} />}
      {user && <h2>Welcome {user.username}</h2>}
    </div>
  )
}

export default App
