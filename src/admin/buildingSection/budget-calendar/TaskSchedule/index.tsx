import React from 'react';
import Sidebar from 'admin/sidebar';
import TaskScheduleContent from './TaskScheduleContent';

export default function TaskSchedule(): JSX.Element {
  return (
    <div style={{ display: 'flex', width: '100%' }}>
      <Sidebar variant='main' activeLink='budget-calendar' />
      <TaskScheduleContent />
    </div>
  );
}
