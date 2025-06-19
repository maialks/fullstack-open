import React from 'react'
import Navbar from '../components/Navbar'

const Button = ({ label }) => (
  <button className='py-1.5 border-b-1 border-white/0 hover:border-secondary cursor-pointer'>
    {label}
  </button>
)

function IndividualBlogPage() {
  return (
    <div className='h-full bg-background'>
      <Navbar />
      <div className=' w-[80%] lg:w-[min(50%,768px)] h-[45%] md:h-[55%] lg:mx-auto mt-[12vh] lg:mt-[17vh] flex flex-col p-4 relative'>
        <span className='text-secondary text-5xl'>Title</span>
        <span className='text-secondary text-md pl-2'>By Lucas Maia</span>
        <span className='text-secondary text-md pl-2 pt-4'>
          You can check out this post directly ate he original source by
          clicking the link bellow:
        </span>
        <a className='p-2 cursor-pointer text-sec-bg text-lg font-semibold'>
          {' '}
          Blog URL
        </a>
        <span className='text-secondary text-md pl-2 pt-2'>
          This is not the original publishing platform for this blog post. It
          was published here by Alex Pereira
        </span>
        <div className='absolute bottom-0 flex pl-2 w-full lg:justify-end text-secondary gap-3'>
          <Button label={'Make Important'} />
          <Button label={'Like'} />
          <Button label={'Next'} />
        </div>
      </div>
    </div>
  )
}

export default IndividualBlogPage
