import React from 'react';
import Sidebar from '../sidebar';
import UnpaidChargesContent from './UnpaidChargesContent';
import './_unpaidCharges.scss';

export default function UnpaidCharges(): JSX.Element {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar variant='main' activeLink='unpaid-charges' />
      <UnpaidChargesContent />
    </div>
  );
}
