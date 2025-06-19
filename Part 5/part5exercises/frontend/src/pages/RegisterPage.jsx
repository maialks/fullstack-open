import React from 'react'
import Navbar from '../components/Navbar'
import FormContainer from '../components/FormContainer'
import FormInput from '../components/FormInput'
import { useNavigate } from 'react-router-dom'

function RegisterPage() {
  const navigate = useNavigate()
  return (
    <div className='h-full bg-background'>
      <Navbar />
      <FormContainer title={'Sign Up'}>
        <FormInput
          name={'login-email'}
          type={'email'}
          placeholder={'user@example.com'}
          label={'Email'}
        />
        <FormInput
          name={'username'}
          type={'text'}
          placeholder={'Create a Username'}
          label={'Username'}
        />
        <FormInput
          name={'login-pass'}
          type={'password'}
          label={'Create Password'}
          placeholder={'••••••••'}
        />
        <div className='grid xl:grid-cols-2 w-[90%] lg:w-[70%] gap-2'>
          <button className='text-secondary p-3 hover:bg-secondary hover:text-primary rounded-lg transition-all cursor-pointer mt-4 border-2 border-sec-bg hover:border-secondary'>
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
