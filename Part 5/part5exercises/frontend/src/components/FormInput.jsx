import React from 'react'

function FormInput({ name, type, placeholder, label }) {
  return (
    <>
      <label
        htmlFor={name}
        className='text-left text-slate-500/80 w-[90%] lg:w-[70%] mb-1'
      >
        {label}
      </label>
      <input
        name={name}
        className='bg-nav-bg py-2.5 px-4 mb-2 w-[90%] lg:w-[70%] rounded-xl text-secondary'
        type={type}
        placeholder={placeholder || ''}
      />
    </>
  )
}

export default FormInput
