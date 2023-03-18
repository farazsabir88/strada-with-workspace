import * as React from 'react';
import Sidebar from 'admin/sidebar';
import RFPContent from './RFPContent';
import './_rfpform.scss';

export default function RFP(): JSX.Element {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar variant='settings' activeLink='rfp-templates' />
      <RFPContent />
    </div>
  );
}
