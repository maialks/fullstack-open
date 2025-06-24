import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'

const ICONS = {
  info: (
    <svg className='w-5 h-5 mr-2 mt-1 fill-current' viewBox='0 0 20 20'>
      <path d='M10 0a10 10 0 100 20A10 10 0 0010 0zM9 9h2v6H9V9zm0-4h2v2H9V5z' />
    </svg>
  ),
  success: (
    <svg className='w-5 h-5 mr-2 mt-1 fill-current' viewBox='0 0 20 20'>
      <path d='M10 0a10 10 0 100 20A10 10 0 0010 0zm-1 15l-5-5 1.41-1.41L9 12.17l5.59-5.59L16 8l-7 7z' />
    </svg>
  ),
  warning: (
    <svg className='w-5 h-5 mr-2 mt-1 fill-current' viewBox='0 0 20 20'>
      <path d='M10 0a10 10 0 100 20A10 10 0 0010 0zm1 14H9v-2h2v2zm0-4H9V6h2v4z' />
    </svg>
  ),
  error: (
    <svg className='w-5 h-5 mr-2 mt-1 fill-current' viewBox='0 0 20 20'>
      <path d='M10 0a10 10 0 100 20A10 10 0 0010 0zm4.29 13.29L13.41 14l-3.41-3.41L6.59 14l-1.17-1.17L8.83 10 5.41 6.59 6.59 5.41 10 8.83l3.41-3.42 1.17 1.18L11.17 10l3.12 3.29z' />
    </svg>
  ),
}

const STYLES = {
  info: 'bg-blue-500 text-white',
  success: 'bg-green-500 text-white',
  warning: 'bg-yellow-500 text-white',
  error: 'bg-red-500 text-white',
}

export default function Notification() {
  const { message, title, type } = useSelector((state) => state.notification)
  return (
    <div className='fixed z-11 flex  justify-center w-full mt-2'>
      <div
        className={`relative flex items-start p-4 md:p-2 rounded shadow-md w-[80%] md:w-[70%] ${STYLES[type]}`}
      >
        {ICONS[type]}

        <div className='flex-1 pr-6'>
          {title && <h4 className='font-bold'>{title}</h4>}
          {message && <p className='text-sm'>{message}</p>}
        </div>
      </div>
    </div>
  )
}
