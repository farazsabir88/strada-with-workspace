/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import {
  Avatar,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from 'mainStore';

function ArrowIcon(): JSX.Element {
  return (
    <svg width='18' height='18' viewBox='0 0 18 18' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path d='M17.0156 8.01562V9.98438H4.82812L10.4062 15.6094L9 17.0156L0.984375 9L9 0.984375L10.4062 2.39062L4.82812 8.01562H17.0156Z' fill='#212121' fillOpacity='0.6' />
    </svg>
  );
}

interface IHeaderProps {
  variant: string | undefined;
}

export default function SidebarHeader(props: IHeaderProps): JSX.Element {
  const currentWorkspace = useSelector((state: RootState) => state.workspaces.currentWorkspace.currentWorkspace);
  const location = useLocation();
  const { variant } = props;
  const navigate = useNavigate();
  const backUrl = localStorage.getItem('backUrl');

  const handleBackButton = (): void => {
    navigate(String(backUrl));
    localStorage.removeItem('backUrl');
  };
  return (
    <div className={!location.pathname.includes('/workspace') ? 'sidebar-header' : 'sidebar-header-2'}>
      <div className='building-details-wrapper'>
        <div className='sb-icon-wrapper'>

          <Avatar sx={{ bgcolor: '#00CFA1' }} variant='rounded' src={`${process.env.REACT_APP_IMAGE_URL}${currentWorkspace.logo_url}`} alt={currentWorkspace.name[0]} />

        </div>
        <div className='sb-text-wrapper'>

          <h6>
            {' '}
            {currentWorkspace.name}
            {' '}
          </h6>

        </div>
      </div>

      {variant === 'settings' ? (
        <div onClick={handleBackButton} className='sidebar-backbutton-2' aria-hidden='true'>
          <ArrowIcon />
          <h6> Back</h6>
        </div>
      ) : (<div className='' />)}

    </div>
  );
}
