import React, { useEffect, useRef } from 'react'
import Navbar from '../../components/Navbar'
import { LoadingSpinner } from '../../components/utils/Icons'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { addComment, initializeBlogs, likeBlog, removeBlog } from './blogsSlice'
import { showNotification } from '../notification/notificationSlice'
import Pagination from '../../components/Pagination'

const Button = ({ label, onClick }) => (
  <button
    className='py-1.5 border-b-1 border-white/0 hover:border-secondary cursor-pointer'
    onClick={(e) => {
      e.stopPropagation
      onClick()
    }}
  >
    {label}
  </button>
)

function BlogPage() {
  const blogs = useSelector((state) => state.blogs)
  const user = useSelector((state) => state.auth)
  const blogId = useParams().id
  const commentRef = useRef()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    if (blogs.status === 'idle') dispatch(initializeBlogs())
  }, [blogs, dispatch])

  const blog = blogs.value.find((blog) => blog.id === blogId)

  useEffect(() => {
    if (blogs.status === 'succeeded' && !blog) {
      navigate('/')
      dispatch(
        showNotification({
          title: 'Blog Not Found',
          message: "We couldn't find the blog you're looking for ",
          type: 'warning',
        })
      )
    }
  }, [blog, navigate, dispatch])

  if (blogs.status === 'idle' || blogs.status === 'loading')
    return (
      <div className='h-full bg-background text-secondary'>
        <Navbar />
        <LoadingSpinner />
      </div>
    )

  if (!blog) {
    navigate('/')
    return null
  }
  console.log(blog)
  const { title, author, url, likes, publisher } = blog

  const handleDelete = async (id) => {
    dispatch(removeBlog(id))
    navigate('/')
  }

  const handleCommentSubmit = (e) => {
    e.preventDefault()
    dispatch(addComment(blog.id, commentRef.current.value))
    commentRef.current.value = ''
  }

  const getRandomBlogId = () => {
    const index = Math.floor(Math.random() * blogs.value.length)
    if (blogs.value[index].id === blogId) {
      if (index === blogs.value.length - 1) return blogs.value[0].id
      return blogs.value[index + 1].id
    }
    return blogs.value[index].id
  }
  return (
    <div className='min-h-screen bg-background'>
      <Navbar />
      <div className=' w-full lg:w-[min(50%,768px)] h-[65%] md:h-[55%] lg:mx-auto mt-[3vh] lg:mt-[17vh] flex flex-col p-4 relative'>
        <span className='text-secondary text-4xl mb-1'>{title}</span>
        <span className='text-secondary text-md pl-2'>By {author}</span>
        <span className='text-secondary text-md pl-2 pt-4'>
          You can check out this post directly ate he original source by
          clicking the link bellow:
        </span>
        <a
          className='p-2 cursor-pointer text-sec-bg text-lg font-semibold truncate'
          href={url}
        >
          {url}
        </a>
        <span className='text-secondary text-md pl-2 pt-2'>
          This is not the original publishing platform for this blog post. It
          was published here by{' '}
          {publisher ? (
            <span
              className='hover:text-secondary/50 cursor-pointer'
              onClick={() => navigate(`/users/${publisher.id}`)}
            >
              {publisher.name}
            </span>
          ) : (
            'Anonymus User'
          )}
        </span>
        <span className='text-secondary text-md pl-2 pt-2'>
          {likes} people liked this blog
        </span>
        <div className='flex pl-2 pt-4 w-full lg:justify-end text-secondary gap-3'>
          <Button label={'Like'} onClick={() => dispatch(likeBlog(blogId))} />
          {blogs.value.length > 1 && (
            <Button
              label={'Next'}
              onClick={() => navigate(`/blogs/${getRandomBlogId()}`)}
            />
          )}
          {publisher && publisher.id === user.userId && (
            <Button onClick={() => handleDelete(blogId)} label={'Delete'} />
          )}
        </div>
        {user.token && (
          <div className='w-full mt-4 text-secondary'>
            <form className='flex justify-between gap-2'>
              <input
                type='text'
                className='w-[90%] border-1 border-secondary rounded-2xl py-2.5 pl-2 text-secondary'
                placeholder='Write your comment here...'
                ref={commentRef}
              />
              <button
                type='submit'
                className='cursor-pointer text-secondary hover:text-secondary/50'
                onClick={handleCommentSubmit}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='36'
                  height='36'
                  fill='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path d='m2.6 10.42 7.64 3.34 3.34 7.64c.16.37.52.6.92.6h.05a1 1 0 0 0 .9-.69l5.5-17c.12-.36.02-.75-.24-1.01a.98.98 0 0 0-1.01-.24L2.69 8.55c-.4.13-.67.49-.69.9-.02.42.22.8.6.97m15.85-4.86-4.09 12.63-2.44-5.59c-.1-.23-.28-.41-.52-.52L5.81 9.64l12.63-4.09Z'></path>
                </svg>
              </button>
            </form>
            {blog.comments.length ? (
              <Pagination
                items={blog.comments}
                itemsPerPage={4}
                render={(itemsToShow) => (
                  <ul className='w-full pt-4 pl-8'>
                    {itemsToShow.map((i) => (
                      <li
                        className='w-[88%] truncate'
                        key={Math.floor(Math.random() * 1000)}
                      >
                        "{i}"
                      </li>
                    ))}
                  </ul>
                )}
              />
            ) : (
              <p className='w-full pt-4 text-center'>
                No comments yet, be the first one to comment
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default BlogPage
