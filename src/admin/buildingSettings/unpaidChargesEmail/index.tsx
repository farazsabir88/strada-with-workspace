import * as React from 'react';
import './_unpaidChargesEmail.scss';
import Sidebar from 'admin/sidebar';
import UnpaidChargesEmailContent from './UnpaidChargesEmailContent';

export default function UnpaidChargesEmail(): JSX.Element {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar variant='settings' activeLink='unpaid-charges-email' />
      <UnpaidChargesEmailContent />
    </div>
  );
}
