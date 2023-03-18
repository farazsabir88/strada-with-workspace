import React from 'react';
import { Typography } from '@mui/material';
import './_annualBudgets.scss';
import FileDragnDrop from './FileDragDrop';

function AnnualBudgetContent(): JSX.Element {
  return (
    <div className='annual-budgets-wrapper'>
      <Typography className='header-budget'> Budget Calendar</Typography>
      <Typography className='desc-budget'>   Only .xls files</Typography>
      <FileDragnDrop />
    </div>
  );
}

export default AnnualBudgetContent;
