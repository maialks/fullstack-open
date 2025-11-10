import React, { useEffect } from 'react'
import Navbar from '../../components/Navbar'
import { initializeUsers } from './usersSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { LoadingSpinner } from '../../components/utils/Icons'

function UserPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const userId = useParams().id
  const users = useSelector((state) => state.users)
  const loggedUser = useSelector((state) => state.auth)

  useEffect(() => {
    if (users.status === 'idle') dispatch(initializeUsers())
  }, [users, dispatch])

  const user = users.value.find((u) => u.id === userId)

  useEffect(() => {
    if (users.status === 'succeeded' && !user) {
      navigate('/users/')
      dispatch(
        showNotification({
          title: 'User Not Found',
          message: 'This user does not exist',
          type: 'warning',
        })
      )
    }
  }, [user, navigate, dispatch])

  if (users.status === 'loading')
    return (
      <div className='h-full bg-background text-secondary'>
        <Navbar />
        <LoadingSpinner />
      </div>
    )

  const formattedDate = new Intl.DateTimeFormat('en-us', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(user?.joined)

  return (
    <div className='min-h-screen bg-background'>
      <Navbar />
      <div className='flex flex-col p-6 text-secondary'>
        <span className='text-5xl font-sora'> Lucas Maia </span>
        <span className='italic'>Since {formattedDate}</span>
        <ul className='pl-5 mt-3 list-disc'>
          {user?.blogs.map((blog) => (
            <li
              key={blog.id}
              onClick={() => navigate(`/blogs/${blog.id}`)}
              className='hover:text-secondary/50 cursor-pointer'
            >
              {blog.title}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default UserPage
