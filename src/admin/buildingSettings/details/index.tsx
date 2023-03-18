import React from 'react';
import Sidebar from 'admin/sidebar';
import DetailForm from './DetailForm';
import './_details.scss';

export default function Details(): JSX.Element {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar variant='settings' activeLink='details' />
      <DetailForm />
    </div>
  );
}
