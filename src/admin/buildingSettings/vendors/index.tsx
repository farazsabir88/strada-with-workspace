import * as React from 'react';
// import './_vendorContacts.scss';
import Sidebar from 'admin/sidebar';
import VendorContent from './VendorContent';
import './_vendors.scss';

export default function Vendors(): JSX.Element {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar variant='settings' activeLink='vendors' />
      <VendorContent />
    </div>
  );
}
