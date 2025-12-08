import React, { useRef } from 'react'
import Navbar from '../../components/Navbar'
import FormContainer from '../../components/FormContainer'
import FormInput from '../../components/FormInput'
import Notification from '../notification/Notification'
import { useDispatch, useSelector } from 'react-redux'
import { showNotification } from '../notification/notificationSlice'
import { createBlog } from './blogsSlice'

function NewBlogPage() {
  const notification = useSelector((state) => state.notification)
  const dispatch = useDispatch()
  const titleRef = useRef(null)
  const authorRef = useRef(null)
  const urlRef = useRef(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const title = titleRef.current.value
    const author = authorRef.current.value
    const url = urlRef.current.value
    if (!title || !author || !url) {
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
    if (dispatch(createBlog({ title, author, url }))) {
      titleRef.current.value = ''
      authorRef.current.value = ''
      urlRef.current.value = ''
    }
  }
  return (
    <div className='min-h-screen bg-background'>
      <Navbar />
      {notification.visible && <Notification />}
      <FormContainer title={'Create Blog'}>
        <FormInput
          id={'blogtitle'}
          type={'text'}
          placeholder={'Ex. Chancellor on brink of second bailout for banks'}
          label={'Title'}
          ref={titleRef}
        />
        <FormInput
          id={'blogauthor'}
          type={'text'}
          placeholder={"Blog's author name"}
          label={'Author'}
          ref={authorRef}
        />
        <FormInput
          id={'blogurl'}
          type={'text'}
          placeholder={'https://myblog.com/example'}
          label={'URL'}
          ref={urlRef}
        />
        <div className='grid w-[90%] lg:w-[70%]'>
          <button
            className='text-secondary p-3 hover:bg-secondary hover:border-secondary hover:text-primary rounded-lg transition-all cursor-pointer mt-4 border-2 border-sec-bg'
            onClick={handleSubmit}
            type='submit'
          >
            Submit
          </button>
        </div>
      </FormContainer>
    </div>
  )
}

export default NewBlogPage
