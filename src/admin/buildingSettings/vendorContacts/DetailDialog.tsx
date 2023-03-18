import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import type { IContactAction, IDeleteAction, IDetailAction } from './types';

interface IDialogProps extends IDetailAction {
  handleClose: () => void;
  deleteContact: (delProps: IDeleteAction) => void;
  editContact: (editProps: IContactAction) => void;
}

export default function DetailDiloag({
  open, handleClose, data, deleteContact, editContact,
}: IDialogProps): JSX.Element {
  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        classes={{
          paper: 'detail-dialog',
        }}
        // maxWidth=''
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>
          <div className='dd-header'>
            <h3>
              {' '}
              {data?.name}
              {' '}
            </h3>
            <div className='dd-header-icons'>
              <i className='far fa-trash-alt' onClick={(): void => { deleteContact({ open: true, id: data?.id }); }} aria-hidden='true' />
              <i
                className='fas fa-pen'
                onClick={(): void => {
                  editContact({ type: 'edit', data });
                }}
                aria-hidden='true'
              />
              <i onClick={handleClose} className='fas fa-times' aria-hidden='true' />
            </div>
          </div>

        </DialogTitle>
        <DialogContent>
          <div className='dd-contact-area'>
            <h4> Contact Info </h4>
            <h6>
              {' '}
              {data?.email}
              {' '}
            </h6>
            <h6>
              {' '}
              {data?.phone}
            </h6>
            <h6>
              {' '}
              {data?.company}
              {' '}
            </h6>
            <h6>
              {' '}
              {data?.notes}
              {' '}
            </h6>
          </div>

        </DialogContent>
      </Dialog>
    </div>
  );
}
