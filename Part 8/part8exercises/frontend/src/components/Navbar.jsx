import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

const NavItem = ({ label, target }) => {
  const navigate = useNavigate()
  const style = {
    cursor: 'pointer',
    padding: 6,
    marginBottom: 4,
    border: '1px solid white',
    borderRadius: '12px',
  }

  return (
    <div style={style} onClick={() => navigate(target)}>
      {label}
    </div>
  )
}

function Navbar() {
  // authors books add
  const style = {
    display: 'flex',
    gap: 10,
    padding: '10px 20px',
  }
  return (
    <div style={style}>
      <NavItem label={'🏠'} target={'/'} />
      <NavItem label={'Authors'} target={'/authors'} />
      <NavItem label={'Books'} target={'/books'} />
      <NavItem label={'Add'} target={'/add'} />
    </div>
  )
}

export default Navbar
