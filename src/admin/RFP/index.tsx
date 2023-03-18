import Sidebar from 'admin/sidebar';
import React from 'react';
import RFPContent from './RFPContent';
import './_rfp.scss';

export default function RFPModule(): JSX.Element {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar variant='main' activeLink='rfps' />
      <RFPContent />
    </div>
  );
}
