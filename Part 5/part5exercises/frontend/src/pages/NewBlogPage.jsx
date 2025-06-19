import React from 'react'
import Navbar from '../components/Navbar'
import FormContainer from '../components/FormContainer'
import FormInput from '../components/FormInput'
// title, author, url
// publisher likes

function NewBlogPage() {
  return (
    <div className='h-full bg-background'>
      <Navbar />
      <FormContainer title={'Create Blog'}>
        <FormInput
          name={'blogtitle'}
          type={'text'}
          placeholder={'Ex. Chancellor on brink of second bailout for banks'}
          label={'Title'}
        />
        <FormInput
          name={'blogauthor'}
          type={'text'}
          placeholder={"Blog's author name"}
          label={'Author'}
        />
        <FormInput
          name={'blogurl'}
          type={'text'}
          placeholder={'https://myblog.com/example'}
          label={'URL'}
        />
        <div className='grid w-[90%] lg:w-[70%]'>
          <button className='text-secondary p-3 hover:bg-secondary hover:border-secondary hover:text-primary rounded-lg transition-all cursor-pointer mt-4 border-2 border-sec-bg'>
            Submit
          </button>
        </div>
      </FormContainer>
    </div>
  )
}

export default NewBlogPage
