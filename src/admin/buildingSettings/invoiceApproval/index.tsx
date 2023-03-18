import React from 'react';
import Sidebar from 'admin/sidebar';
import InvoiceContent from './InvoiceContent';

export default function InvoiceApproval(): JSX.Element {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar variant='settings' activeLink='invoice-approval' />
      <InvoiceContent />
    </div>

  );
}
