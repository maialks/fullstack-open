import React from 'react'

const FormInput = React.forwardRef(function (
  { id, type, placeholder, label },
  ref
) {
  return (
    <>
      <label
        htmlFor={id}
        className='text-left text-slate-500/80 w-[90%] lg:w-[70%] mb-1'
      >
        {label}
      </label>
      <input
        id={id}
        className='bg-nav-bg py-2.5 px-4 mb-2 w-[90%] lg:w-[70%] rounded-xl text-secondary'
        type={type}
        placeholder={placeholder || ''}
        ref={ref}
      />
    </>
  )
})

export default FormInput
