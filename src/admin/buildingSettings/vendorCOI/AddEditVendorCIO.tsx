import React from 'react';
import Sidebar from 'admin/sidebar';
import FormSide from './FormSide';

export default function AddEditVendorCIO(): JSX.Element {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar variant='settings' activeLink='vendor-coi' />
      <FormSide />
    </div>
  );
}
