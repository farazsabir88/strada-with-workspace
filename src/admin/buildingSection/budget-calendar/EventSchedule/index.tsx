import React from 'react';
import Sidebar from 'admin/sidebar';
import EventScheduleContent from './EventScheduleContent';

export default function EventSchedule(): JSX.Element {
  return (
    <div style={{ display: 'flex', width: '100%' }}>
      <Sidebar variant='main' activeLink='budget-calendar' />
      <EventScheduleContent />
    </div>
  );
}
