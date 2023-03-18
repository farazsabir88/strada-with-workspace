import * as React from 'react';
import Sidebar from 'admin/sidebar';
import AnnualBudgetContent from './AnnualBudgetContent';

export default function ChartsOfAccounts(): JSX.Element {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar variant='settings' activeLink='annual-budgets' />
      <AnnualBudgetContent />
    </div>
  );
}
