/* eslint-disable react/no-unknown-property */
import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import Logo from 'assests/images/Logo.png';
import SecondaryButton from 'shared-components/components/SecondaryButton';

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
          {open ? <i className='fa-solid fa-glass' /> : <i className='fa-solid fa-glass' />}

        </div>
      </div>

      {open ? (
        <div className='mobile-list'>
          <div className='mobile-list-wrapper container'>
            <NavLink
              to='/learn-more'
              onClick={(): void => { setOpen(false); }}
              className={({ isActive }: { isActive: boolean }): string => (isActive ? 'nav-link p-2 activeLinkClass' : 'nav-link p-2')}
            >
              Learn More
            </NavLink>
            <NavLink
              to='/contact-us'
              onClick={(): void => { setOpen(false); }}
              className={({ isActive }: { isActive: boolean }): string => (isActive ? 'nav-link p-2 activeLinkClass' : 'nav-link p-2')}
            >
              Contact Us
            </NavLink>
            <NavLink
              to='/signin'
              onClick={(): void => { setOpen(false); }}
              className={({ isActive }: { isActive: boolean }): string => (isActive ? 'nav-link p-2 activeLinkClass' : 'nav-link p-2')}
            >
              Login
            </NavLink>
            <SecondaryButton style={{ marginTop: '12rem' }} fullWidth onClick={(): void => { navigate('/requestdemo'); }}> Request Demo </SecondaryButton>

          </div>
        </div>
      ) : ''}

    </nav>
  );
}
