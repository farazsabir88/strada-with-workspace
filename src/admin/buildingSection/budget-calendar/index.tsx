import React from 'react';
import Sidebar from 'admin/sidebar';
import BudgetCalendarContent from './BudgetCalendarContent';

export default function BudgetCalendar(): JSX.Element {
  return (
    <div style={{ display: 'flex', width: '100%' }}>
      <Sidebar variant='main' activeLink='budget-calendar' />
      <BudgetCalendarContent />
    </div>
  );
}
