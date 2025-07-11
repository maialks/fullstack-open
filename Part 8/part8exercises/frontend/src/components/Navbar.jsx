import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const NavItem = ({ label, onClick }) => {
  const style = {
    cursor: 'pointer',
    padding: 6,
    marginBottom: 4,
    border: '1px solid white',
    borderRadius: '12px',
  }

  return (
    <div style={style} onClick={onClick}>
      {label}
    </div>
  )
}

function Navbar() {
  const navigate = useNavigate()
  const { token, logout } = useAuth()
  const style = {
    display: 'flex',
    gap: 10,
    padding: '10px 20px',
    backgroundColor: '#1a1a1a',
  }
  return (
    <div style={style}>
      <NavItem label={'🏠'} onClick={() => navigate('/')} />
      <NavItem label={'Authors'} onClick={() => navigate('/authors')} />
      <NavItem label={'Books'} onClick={() => navigate('/books')} />
      {token && <NavItem label={'Add'} onClick={() => navigate('/add')} />}
      {token && <NavItem label={'Logout'} onClick={logout} />}
    </div>
  )
}

export default Navbar
