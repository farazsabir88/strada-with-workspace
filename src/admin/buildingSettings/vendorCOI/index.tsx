import React from 'react';
import Sidebar from 'admin/sidebar';
import ContentPage from './ContentPage';
import './_vendorCOI.scss';

export default function VendorCOI(): JSX.Element {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar variant='settings' activeLink='vendor-coi' />
      <ContentPage />
    </div>
  );
}
