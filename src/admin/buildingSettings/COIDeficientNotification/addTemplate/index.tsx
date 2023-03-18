import * as React from 'react';
import './_addTemplate.scss';
import Sidebar from 'admin/sidebar';
import AddTemplate from './AddTemplate';

export default function UnpaidChargesEmail(): JSX.Element {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar variant='settings' activeLink='coi-deficient-notifications' />
      <AddTemplate />
    </div>
  );
}
