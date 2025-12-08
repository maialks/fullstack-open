import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import User from './User'

function UsersContainer({ users }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const handleLike = (id) => dispatch(likeBlog(id))
  return (
    <div
      className='grid gap-4 w-[80%] mx-auto'
      style={{
        gridTemplateColumns: 'repeat(auto-fit, minmax(330px, 1fr))',
      }}
    >
      {users.map((user) => (
        <User user={user} key={user.id} />
      ))}
    </div>
  )
}

export default UsersContainer
