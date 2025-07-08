import { useState } from 'react'

const useField = (type, initial = '') => {
  const [value, setValue] = useState(initial)
  const onChange = (e) => setValue(e.target.value)

  return {
    setValue,
    inputProps: {
      value,
      type,
      onChange,
    },
  }
}

export default useField
