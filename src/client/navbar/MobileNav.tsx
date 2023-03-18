/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/self-closing-comp */
import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import Logo from 'assests/images/Logo.png';
import SecondaryButton from 'shared-components/components/SecondaryButton';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';

export default function MobileNav(): JSX.Element {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  return (
    <nav className='navbar-container'>
      <div className='main-navbar container'>

        {/* Left side ==> */}
        <div className='left-side-nav'>
          <Link to='/' className='logo-wrapper'>
            <img src={Logo} alt='strada-logo' />
          </Link>
        </div>

        <div className='right-side-nav'>
          <div className='client-nav-links' />
          {open ? <i className='fa-solid fa-xmark mobile-hamburger-cross' style={{ fontSize: '18px', marginRight: '7px', marginTop: '2px' }} onClick={(): void => { setOpen(false); }}></i> : <MenuRoundedIcon className='mobile-hamburger' onClick={(): void => { setOpen(true); }} />}

        </div>
      </div>
      {open ? (
        <div className='mobile-list'>
          <div className='mobile-list-wrapper'>
            <NavLink
              to='/learn-more'
              onClick={(): void => { setOpen(false); }}
              className={({ isActive }): string => (isActive ? 'activeLinkClass nav-mobile' : 'nav-mobile')}
            >
              Learn More
            </NavLink>
            <NavLink
              to='/contact-us'
              onClick={(): void => { setOpen(false); }}
              className={({ isActive }): string => (isActive ? 'nav-mobile' : 'nav-mobile')}
            >
              Contact Us
            </NavLink>
            <NavLink
              to='/signin'
              onClick={(): void => { setOpen(false); }}
              className={({ isActive }): string => (isActive ? 'nav-mobile' : 'nav-mobile')}
            >
              Login
            </NavLink>
            <SecondaryButton
              style={{
                margin: 'auto', marginTop: '47vh', width: '92%', height: '37px', fontSize: '15px',
              }}
              fullWidth
              onClick={(): void => { navigate('/requestdemo'); }}
            >
              {' '}
              Request Demo
            </SecondaryButton>

          </div>
        </div>
      ) : ''}

    </nav>
  );
}
