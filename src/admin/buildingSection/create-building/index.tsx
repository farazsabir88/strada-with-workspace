import * as React from 'react';
import Sidebar from 'admin/sidebar';
import CreateBuilding from './CreateBuilding';

export default function Buildings(): JSX.Element {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar variant='main' activeLink='properties' />
      <CreateBuilding />
    </div>
  );
}
