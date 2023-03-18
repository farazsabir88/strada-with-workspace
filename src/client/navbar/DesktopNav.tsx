import React from 'react';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import Logo from 'assests/images/Logo.png';
import SecondaryButton from 'shared-components/components/SecondaryButton';

export default function DesktopNav(): JSX.Element {
  const navigate = useNavigate();
  return (

    <nav className='navbar-container'>
      <div className='container'>
        <div className='main-navbar container'>

          {/* Left side ==> */}
          <div className='left-side-nav'>
            <Link to='/' className='logo-wrapper'>
              <img src={Logo} alt='strada-logo' />
            </Link>
          </div>

          <div className='right-side-nav'>
            <div className='client-nav-links'>
              <NavLink
                to='/learn-more'
                className={({ isActive }): string => (isActive ? 'nav-link par-3 activeLinkClass' : 'nav-link par-3')}
              >
                Learn More
              </NavLink>
              <NavLink
                to='/contact-us'
                className={({ isActive }): string => (isActive ? 'nav-link par-3 activeLinkClass' : 'nav-link par-3')}
              >
                Contact Us
              </NavLink>
              <NavLink to='/signin' className={({ isActive }): string => (isActive ? 'nav-link par-3 activeLinkClass' : 'nav-link par-3')}>
                Login
              </NavLink>
              <div className='demo-btn'>
                <SecondaryButton onClick={(): void => { navigate('/requestdemo'); }}> Request Demo </SecondaryButton>
              </div>
            </div>

          </div>
        </div>
      </div>
    </nav>

  );
}
