import React from 'react';
import './_clientNavbar.scss';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import DesktopNav from './DesktopNav';
import MobileNav from './MobileNav';

export default function Navbar(): JSX.Element {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <div>
      {matches ? <MobileNav /> : <DesktopNav />}
      {/* <div style={
        {
          height: '72px',
        }
      }
      /> */}
      {' '}

    </div>
  );
}
