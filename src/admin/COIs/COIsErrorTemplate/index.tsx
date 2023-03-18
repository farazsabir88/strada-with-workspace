import React from 'react';
import Sidebar from 'admin/sidebar';
import ErrorTemplateCOIs from './ErrorTemplate';

export default function UnpaidCharges(): JSX.Element {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar variant='main' activeLink='cois' />
      <ErrorTemplateCOIs />
    </div>
  );
}
