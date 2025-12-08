import React from 'react'
import { useNavigate } from 'react-router-dom'

function User({ user }) {
  const navigate = useNavigate()
  const formattedDate = new Intl.DateTimeFormat('en-us', {
    month: 'short',
    year: 'numeric',
  }).format(user.joined)
  return (
    <div className='h-22 w-full border-l-4 border-sec-bg m-1 rounded-lg py-2 pl-2 bg-nav-bg/20 text-secondary flex flex-col'>
      <span
        className='text-2xl hover:text-secondary/50 cursor-pointer'
        onClick={() => navigate(`/users/${user.id}`)}
      >
        {user.name}
      </span>
      <span className='text-xs text-secondary/70 italic'>
        Membro desde {formattedDate}
      </span>
      <span className='text-secondary/80'>
        This user has {user.blogs.length} published blogs
      </span>
    </div>
  )
}

export default User
