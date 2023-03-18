import * as React from 'react';
import './_tasks.scss';
import Sidebar from 'admin/sidebar';
import TasksContent from './TasksContent';

export default function Tasks(): JSX.Element {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar variant='settings' activeLink='tasks-templates' />
      <TasksContent />
    </div>
  );
}
