import * as React from 'react';
import './_chartOfAccounts.scss';
import Sidebar from 'admin/sidebar';
import AccountsContent from './AccountsContent';

export default function ChartsOfAccounts(): JSX.Element {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar variant='settings' activeLink='chart-of-accounts' />
      <AccountsContent />
    </div>
  );
}
