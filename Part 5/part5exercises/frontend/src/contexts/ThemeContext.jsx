import { createContext, useEffect, useState } from 'react'

export const ThemeContext = createContext()

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark')

  // Só roda na montagem
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme')
    const prefersLight = window.matchMedia(
      '(prefers-color-scheme: light)'
    ).matches
    const initial = storedTheme || (prefersLight ? 'light' : 'dark')
    setTheme(initial)
  }, [])

  // Reage a mudanças de tema
  useEffect(() => {
    document.getElementById('root').classList.toggle('dark', theme === 'dark')
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
