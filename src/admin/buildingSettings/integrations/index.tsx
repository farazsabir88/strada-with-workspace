import React from 'react';
import Sidebar from 'admin/sidebar';
import IntegrationContent from './IntegrationContent';
import './_integrationStyle.scss';

export default function Integrations(): JSX.Element {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar variant='settings' activeLink='integration' />
      <IntegrationContent />
    </div>

  );
}
