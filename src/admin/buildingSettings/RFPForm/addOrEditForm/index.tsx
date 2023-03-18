import * as React from 'react';
import Sidebar from 'admin/sidebar';
import AddRFPForm from './AddRFPForm';

export default function AddOrEditRFP(): JSX.Element {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar variant='settings' activeLink='rfp-templates' />
      <AddRFPForm />
    </div>
  );
}
