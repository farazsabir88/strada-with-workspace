import * as React from 'react';
import './_checklistListing.scss';
import Sidebar from 'admin/sidebar';
import ChecklistListing from './ChecklistListing';

export default function Checklists(): JSX.Element {
  return (
    <div style={{ display: 'flex' }}>
      {window.innerWidth > 600
      && <Sidebar variant='main' activeLink='checklists' />}
      <ChecklistListing />
    </div>
  );
}
