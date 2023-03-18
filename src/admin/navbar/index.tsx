import React from 'react';
import './_adminNavbar.scss';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useSelector } from 'react-redux';
import type { RootState } from 'mainStore';
import DesktopNav from './DesktopNav';
import AdminMobileNav from './AdminMobileNav';
// import MobileNav from './MobileNav';

export default function Navbar(): JSX.Element {
  const user = useSelector((state: RootState) => state.auth.user);
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('md'));
  return (
    <div>
      {matches
        ? <AdminMobileNav user={user} />
        : <DesktopNav user={user} />}
      {/* <div style={{ height: '72px' }} /> */}
    </div>
  );
}
