// src/context/ThemeContext.jsx
import { createContext, useEffect, useState } from 'react'

export const ThemeContext = createContext()

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() =>
    document.getElementById('root').classList.contains('dark')
      ? 'dark'
      : 'light'
  )

  useEffect(() => {
    const root = document.getElementById('root')
    if (!root) return
    root.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () =>
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export default ThemeProvider
