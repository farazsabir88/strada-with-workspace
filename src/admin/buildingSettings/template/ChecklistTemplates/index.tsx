import * as React from 'react';
import './_checklist-template.scss';
import Sidebar from 'admin/sidebar';
import ChecklistList from './ChecklistList';

export default function ChecklistTemplates(): JSX.Element {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar variant='settings' activeLink='checklist-templates' />
      <ChecklistList />
    </div>
  );
}
