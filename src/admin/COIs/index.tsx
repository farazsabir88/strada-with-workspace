import React from 'react';
import Sidebar from '../sidebar';
import COIsContent from './COIsContent';
import './_COIs.scss';

export default function UnpaidCharges(): JSX.Element {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar variant='main' activeLink='cois' />
      <COIsContent />
    </div>
  );
}
