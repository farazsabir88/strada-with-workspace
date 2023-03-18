import * as React from 'react';
import Sidebar from 'admin/sidebar';
import AddTemplate from './AddTemplate';

export default function TasksAddTemplates(): JSX.Element {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar variant='settings' activeLink='tasks-templates' />
      <AddTemplate />
    </div>
  );
}
