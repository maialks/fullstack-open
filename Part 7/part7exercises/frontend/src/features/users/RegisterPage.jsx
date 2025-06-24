import React, { useRef } from 'react'
import Navbar from '../../components/Navbar'
import FormContainer from '../../components/FormContainer'
import FormInput from '../../components/FormInput'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Notification from '../notification/Notification'
import { showNotification } from '../notification/notificationSlice'

function RegisterPage() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const notification = useSelector((state) => state.notification)

  const nameRef = useRef(null)
  const usernameRef = useRef(null)
  const emailRef = useRef(null)
  const passwordRef = useRef(null)

  const handleRegister = async (e) => {
    try {
      e.preventDefault()
      const name = nameRef.current.value
      const username = usernameRef.current.value
      const email = emailRef.current.value
      const password = passwordRef.current.value

      if (!name || !username || !email || !password) {
        dispatch(
          showNotification({
            title: 'Empty Field',
            message: 'All fields are required',
            type: 'warning',
            duration: 2000,
          })
        )
        return
      }
      // await register({ username, name, password })
      dispatch(showNotification({ title: 'User Created', type: 'success' }))
      // navigate('/login')
    } catch (err) {
      console.log(err)
      dispatch(
        showNotification({
          title: 'Failed',
          message: err.message,
          type: 'error',
        })
      )
    }
  }

  return (
    <div className='min-h-screen bg-background'>
      <Navbar />
      {notification.visible && <Notification />}
      <FormContainer title={'Sign Up'}>
        <FormInput
          id={'name'}
          type={'text'}
          placeholder={'Your Name'}
          label={'Username'}
          ref={nameRef}
        />
        <FormInput
          id={'login-email'}
          type={'email'}
          placeholder={'user@example.com'}
          label={'Email'}
          ref={emailRef}
        />
        <FormInput
          id={'username'}
          type={'text'}
          placeholder={'Create a Username'}
          label={'Username'}
          ref={usernameRef}
        />
        <FormInput
          id={'login-pass'}
          type={'password'}
          label={'Create Password'}
          placeholder={'••••••••'}
          ref={passwordRef}
        />
        <div className='grid xl:grid-cols-2 w-[90%] lg:w-[70%] gap-2'>
          <button
            className='text-secondary p-3 hover:bg-secondary hover:text-primary rounded-lg transition-all cursor-pointer mt-4 border-2 border-sec-bg hover:border-secondary'
            onClick={handleRegister}
          >
            Sign Up
          </button>
          <button
            className='text-secondary p-3 hover:bg-secondary hover:text-primary rounded-lg transition-all cursor-pointer mt-4'
            onClick={() => navigate('/login')}
          >
            Have an Account? Sign In
          </button>
        </div>
      </FormContainer>
    </div>
  )
}

export default RegisterPage
