import React from 'react'
import { Exclamation } from './utils/Icons'

function Blog({ blog }) {
  return (
    <div
      className='rounded-xl h-auto overflow-hidden text-secondary bg-sec-bg p-2 max-h-10
      md:max-h-16 md:p-3 shadow-lg'
    >
      <p className='flex items-start justify-between align-middle'>
        <span className='max-w-[80%] inline-block truncate ml-2'>
          {blog.content}
        </span>
        <button className='mr-2'>
          <Exclamation />
        </button>
      </p>
    </div>
  )
}

export default Blog
