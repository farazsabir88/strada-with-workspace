/* eslint-disable react/no-unknown-property */
import React, { useState } from 'react';
import {
  IconButton, Avatar, Popover,
} from '@mui/material';
import type { MouseEvent } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from 'client/login/store';
import { Link } from 'react-router-dom';
import Logo from 'assests/images/Logo.png';
import type { Iuser } from 'types';

interface Iprops {
  user: Iuser | null;
}

function HomeIcon(): JSX.Element {
  return (
    <svg width='20' height='18' viewBox='0 0 20 18' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path d='M7.98438 17.0156H3.01562V9H0.015625L10 0L19.9844 9H16.9844V17.0156H12.0156V11.0156H7.98438V17.0156Z' fill='#212121' fill-opacity='0.6' />
    </svg>
  );
}

export default function AdminMobileNav(props: Iprops): JSX.Element {
  const dispatch = useDispatch();
  const { user } = props;
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  const handleClick: (event: MouseEvent<HTMLElement>) => void = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose: () => void = () => {
    setAnchorEl(null);
  };

  return (
    <nav className='navbar-container'>
      <div className='main-navbar container'>
        <Link to='/' className='logo-wrapper'>
          <HomeIcon />
        </Link>
        <div className='left-side-nav'>
          <Link to='/' className='logo-wrapper'>
            <img src={Logo} alt='strada-logo' />
          </Link>
        </div>
        <IconButton onClick={handleClick}>
          <Avatar
            src={`${process.env.REACT_APP_IMAGE_URL}${user?.avatar}`}
          >
            {user?.first_name}
          </Avatar>

        </IconButton>

        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >

          <div className='setting-popver-right'>
            <div onClick={(): { type: string; payload: undefined } => dispatch(logout())} className='account-setting-option-2' aria-hidden='true'> Logout </div>
          </div>

        </Popover>

      </div>

    </nav>
  );
}
