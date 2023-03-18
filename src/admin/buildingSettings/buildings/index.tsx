import * as React from 'react';
import Sidebar from 'admin/sidebar';
import BuildingListing from './BuildingListing';

export default function Buildings(): JSX.Element {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar variant='main' activeLink='properties' />
      <BuildingListing />
    </div>
  );
}
