import React from 'react';
import Sidebar from 'admin/sidebar';
import RFPScheduleContent from './RFPScheduleContact';

export default function RFPSchedule(): JSX.Element {
  return (
    <div style={{ display: 'flex', width: '100%' }}>
      <Sidebar variant='main' activeLink='budget-calendar' />
      <RFPScheduleContent />
    </div>
  );
}
