import * as React from 'react';
import Sidebar from 'admin/sidebar';
import EditBuilding from './Edit';

export default function Buildings(): JSX.Element {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar variant='main' activeLink='properties' />
      <EditBuilding />
    </div>
  );
}
