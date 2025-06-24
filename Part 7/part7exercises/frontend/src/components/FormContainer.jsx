import React from 'react'

function FormContainer({ title, children }) {
  return (
    <div className=' w-[80%] lg:w-[min(50%,768px)] h-[45%] md:h-[65%] mx-auto mt-[12vh] lg:mt-[17vh] flex flex-col items-center'>
      <span className='text-secondary font-sora text-[2.7em] pt-2 border-b border-slate-700/50 w-full text-center mb-6 pb-4'>
        {title}
      </span>
      <form className='w-full flex flex-col items-center'>{children}</form>
    </div>
  )
}

export default FormContainer
