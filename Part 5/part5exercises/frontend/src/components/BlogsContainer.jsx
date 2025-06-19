import React from 'react'
import Blog from './Blog'

function BlogsContainer({ blogs }) {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 md:gap-6 gap-4 mt-6 mx-[8%] lg:mx-[10%] md:mt-24 w-[80%]'>
      {blogs.map((blog, index) => (
        <Blog key={index} blog={blog} />
      ))}
    </div>
  )
}

export default BlogsContainer
