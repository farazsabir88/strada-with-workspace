import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import SecondaryButton from './SecondaryButton';

interface IDialogProps {
  open: boolean;
  handleClose: () => void;
  action: () => void;
  text: string;
  header: string;
  btnText: string;
}

export default function DialogSkeleton({
  open, text, header, btnText, handleClose, action,
}: IDialogProps): JSX.Element {
  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth='sm'
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>
          <h2 className='dialog-heading'>
            {' '}
            {header}
          </h2>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>

            {' '}
            {text}

          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <SecondaryButton className='secondary-btn-secondary' onClick={handleClose}>Cancel</SecondaryButton>
          <SecondaryButton className='primary-btn' form='gl-form' onClick={action}>{btnText}</SecondaryButton>
        </DialogActions>
      </Dialog>
    </div>
  );
}
