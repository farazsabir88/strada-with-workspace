import * as React from 'react';
import Sidebar from 'admin/sidebar';
import AddVendorContent from './AddVendor';

export default function AddVendor(): JSX.Element {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar variant='settings' activeLink='vendors' />
      <AddVendorContent />
    </div>
  );
}
