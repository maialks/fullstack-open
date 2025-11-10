import React, { useContext, useState, useRef, useEffect } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import { Sun, Moon } from './utils/Icons';
import BloglistLogo from './utils/BloglistLogo';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { endSession } from '../features/auth/authSlice';

const ThemeIcon = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <>
      <i
        onClick={(e) => {
          e.stopPropagation();
          toggleTheme();
        }}
        className='cursor-pointer'
      >
        {theme === 'dark' ? <Sun /> : <Moon />}
      </i>
    </>
  );
};

const NavItem = ({ target, label }) => {
  return (
    <NavLink
      to={target}
      className='text-secondary p-3 hover:bg-secondary hover:text-primary 
    rounded-lg transition-all cursor-pointer whitespace-nowrap'
    >
      <span>{label}</span>
    </NavLink>
  );
};

const NavItems = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loggedUser = useSelector((state) => state.auth);

  return (
    <>
      <NavItem target={'/'} label={'Home'} />
      {loggedUser.token === null && <NavItem target={'/login'} label={'Sign In'} />}
      {loggedUser.token === null && <NavItem target={'/register'} label={'Sign Up'} />}
      {loggedUser.token !== null && <NavItem target={'/users'} label={'Users'} />}
      {loggedUser.token !== null && <NavItem target={'/add'} label={'New Blog'} />}
      {loggedUser.token !== null && (
        <span
          className='text-secondary p-3 hover:bg-secondary hover:text-primary 
    rounded-lg transition-all cursor-pointer whitespace-nowrap'
          onClick={() => {
            dispatch(endSession());
            navigate('/');
          }}
        >
          Log Out
        </span>
      )}
      <ThemeIcon />
    </>
  );
};

const NavbarDesktopMenu = () => {
  return (
    <ul className='hidden md:flex items-center gap-6 font-semibold text-secondary text-base list-none'>
      <NavItems />
    </ul>
  );
};

const NavbarMobileMenu = ({ isOpen, toggleMenu, menuRef }) => {
  return (
    <div
      className='flex md:hidden text-secondary cursor-pointer items-center p-3'
      onClick={toggleMenu}
      ref={menuRef}
    >
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='24'
        height='24'
        fill='currentColor'
        viewBox='0 0 24 24'
      >
        <path d='M4 6h16v2H4zM4 11h16v2H4zM4 16h16v2H4z'></path>
      </svg>
      {isOpen && <DropdownMenu />}
    </div>
  );
};

const DropdownMenu = () => {
  return (
    <ul
      className='absolute top-20 left-0 w-full bg-background 
      flex flex-col items-center gap-4 font-semibold text-lg pb-3 z-1'
    >
      <NavItems />
    </ul>
  );
};

const Navbar = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isMobileMenuOpen) {
      const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
          setMobileMenuOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isMobileMenuOpen]);

  return (
    <header className='flex justify-between items-center py-1 px-6 bg-nav-bg text-secondary'>
      <div className='cursor-pointer' onClick={() => navigate('/')}>
        <BloglistLogo />
      </div>
      <NavbarDesktopMenu />
      <NavbarMobileMenu
        isOpen={isMobileMenuOpen}
        toggleMenu={() => setMobileMenuOpen((prev) => !prev)}
        menuRef={menuRef}
      />
    </header>
  );
};

export default Navbar;
