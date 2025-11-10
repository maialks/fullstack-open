import React, { useRef } from 'react'
import Navbar from '../../components/Navbar'
import FormContainer from '../../components/FormContainer'
import FormInput from '../../components/FormInput'
import { useNavigate } from 'react-router-dom'
import { loginUser, setLoading } from './authSlice'
import { useDispatch, useSelector } from 'react-redux'
import Notification from '../notification/Notification'

function LoginPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const usernameRef = useRef(null)
  const passwordRef = useRef(null)

  const notification = useSelector((state) => state.notification)
  const handleSubmit = async (e) => {
    dispatch(setLoading(true))
    e.preventDefault()
    const username = usernameRef.current.value
    const password = passwordRef.current.value
    if (!username || !password) return
    const logged = await dispatch(loginUser({ username, password }))
    passwordRef.current.value = ''
    if (logged) {
      usernameRef.current.value = ''
      await new Promise((resolve) => setTimeout(resolve, 2200))
      navigate('/')
    }
    dispatch(setLoading(false))
  }
  return (
    <div className='h-full bg-background'>
      <Navbar />
      {notification.visible && <Notification />}
      <FormContainer title={'Sign In'}>
        <FormInput
          id={'login-user'}
          type={'text'}
          placeholder={'enter your username'}
          label={'Username'}
          ref={usernameRef}
        />
        <FormInput
          id={'login-pass'}
          type={'password'}
          label={'Password'}
          placeholder={'••••••••'}
          ref={passwordRef}
        />
        <div className='grid xl:grid-cols-2 w-[90%] lg:w-[70%] gap-2'>
          <button
            className='text-secondary p-3 hover:bg-secondary hover:text-primary rounded-lg transition-all cursor-pointer mt-4 border-2 border-sec-bg hover:border-secondary'
            onClick={handleSubmit}
            type='submit'
          >
            Sign In
          </button>
          <button
            className='text-secondary p-3 hover:bg-secondary hover:text-primary rounded-lg transition-all cursor-pointer mt-4'
            onClick={() => navigate('/register')}
          >
            No Account? Sign Up
          </button>
        </div>
      </FormContainer>
    </div>
  )
}

export default LoginPage
