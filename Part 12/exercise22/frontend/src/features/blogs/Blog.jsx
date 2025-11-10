import React from 'react'
import { Like } from '../../components/utils/Icons'

function Blog({ blog: { likes, title }, onClick, onLike }) {
  return (
    <div
      className='rounded-xl h-auto overflow-hidden text-secondary bg-sec-bg p-2 max-h-10
      md:max-h-16 md:p-3 shadow-lg'
    >
      <div className='flex items-start justify-between align-middle'>
        <span
          className='max-w-[55%] inline-block truncate ml-2 cursor-pointer'
          onClick={onClick}
        >
          {title}
        </span>
        <div className='flex gap-2'>
          {`${likes < 10000 ? likes : '10k+'} Likes`}
          <button className='mr-2 h-6' onClick={onLike}>
            <Like className={'w-full h-full cursor-pointer'} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Blog
