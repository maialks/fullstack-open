import React from 'react'
import Blog from './Blog'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { likeBlog } from './blogsSlice'

function BlogsContainer({ blogs }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const handleLike = (id) => dispatch(likeBlog(id))
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 md:gap-6 gap-4 mt-6 mx-[8%] lg:mx-[10%] md:mt-24 w-[80%]'>
      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          onClick={() => navigate(`blogs/${blog.id}`)}
          onLike={() => handleLike(blog.id)}
        />
      ))}
    </div>
  )
}

export default BlogsContainer
