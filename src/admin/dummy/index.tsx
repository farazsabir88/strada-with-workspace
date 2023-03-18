import React from 'react';
import Sidebar from '../sidebar';

export default function Dummy(): JSX.Element {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar variant='main' activeLink='budget-calendar' />
      <div>Building section are in progress</div>
    </div>
  );
}
