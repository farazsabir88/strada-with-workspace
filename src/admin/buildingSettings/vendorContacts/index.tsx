import * as React from 'react';
import './_vendorContacts.scss';
import Sidebar from 'admin/sidebar';
import ContactsConent from './ContactsConent';

export default function VendorContacts(): JSX.Element {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar variant='settings' activeLink='vendor-contacts' />
      <ContactsConent />
    </div>
  );
}
