import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Checkbox from '@mui/material/Checkbox';
import _ from 'lodash';
import SecondaryButton from 'shared-components/components/SecondaryButton';

interface IDialogProps {
  open: boolean;
  handleClose: () => void;
  setMainRange: (range: string[]) => void;
}

const optionsData = [
  {
    name: '01-29 days overdue',
    value: '01-29-days',
  },
  {
    name: '30-59 days overdue',
    value: '30-59-days',
  },
  {
    name: '60-89 days overdue',
    value: '60-89-days',
  },
  {
    name: '90 + days overdue',
    value: 'over-90-days',
  },
];

export default function CreateInvoiceDialog({ open, handleClose, setMainRange }: IDialogProps): JSX.Element {
  const [range, setRange] = useState<string[]>([]);

  const handleChange = (value: string): void => {
    const isInclueded = _.includes(range, value);
    if (isInclueded) {
      const newRange = _.reject(range, (val) => val === value);
      setRange(newRange);
    } else {
      const newRange = [...range, value];
      setRange(newRange);
    }
  };

  const handleSaveButton = (): void => {
    setMainRange(range);
    handleClose();
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth='xs'
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>
          <h3 className='dialog-heading'> Create New Invoice </h3>
        </DialogTitle>
        <DialogContent>
          <div className='cid-contant-wrapper'>
            <h5 className='sub-heading'>
              Select past due date range
            </h5>
            <div className='cid-options-wrapper'>
              {optionsData.map((val) => (
                <div className='cid-option'>
                  <span>
                    {' '}
                    <Checkbox onChange={(): void => { handleChange(val.value); }} checked={_.includes(range, val.value)} />
                    {' '}
                  </span>
                  <p>
                    {' '}
                    {val.name}
                    {' '}
                  </p>
                </div>
              ))}

            </div>

          </div>

        </DialogContent>
        <DialogActions>
          <SecondaryButton className='secondary-btn-secondary' onClick={handleClose}>Cancel</SecondaryButton>
          <SecondaryButton className='secondary-diloag-btn' form='gl-form' type='submit' onClick={handleSaveButton}>Save</SecondaryButton>
        </DialogActions>
      </Dialog>
    </div>
  );
}
