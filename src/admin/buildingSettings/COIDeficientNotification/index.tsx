import * as React from 'react';
import './_coiNotifications.scss';
import Sidebar from 'admin/sidebar';
import COIContent from './COIContent';

export default function COI(): JSX.Element {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar variant='settings' activeLink='coi-deficient-notifications' />
      <COIContent />
    </div>
  );
}
