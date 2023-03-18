import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import SecondaryButton from 'shared-components/components/SecondaryButton';
import StradaLoader from 'shared-components/components/StradaLoader';
import { useSnackbar } from 'notistack';

import type { IDeleteAction } from './types';

interface IDialogProps {
  delAction: IDeleteAction;
  handleClose: () => void;
}

export default function DeleteDiloag({ delAction, handleClose }: IDialogProps): JSX.Element {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const { mutate: deleteContact, isLoading: deleting } = useMutation(
    async () => axios({
      url: `/api/vendor-contact/${delAction.id}/`,
      method: 'DELETE',
    }),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries('get/vendor-contacts').catch()
          .then();
        handleClose();
        enqueueSnackbar('Vendor deleted successfully');
      },
    },
  );
  return (
    <div>
      <StradaLoader open={deleting} message='Delete in progress' />
      <Dialog
        open={delAction.open}
        onClose={handleClose}
        fullWidth
        maxWidth='sm'
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>
          <h3 className='dialog-heading'> Are you sure you want to delete this contact? </h3>
        </DialogTitle>
        <DialogContent />
        <DialogActions>
          <SecondaryButton className='secondary-btn-secondary' onClick={handleClose}>Cancel</SecondaryButton>
          <SecondaryButton className='secondary-diloag-btn' onClick={(): void => { deleteContact(); handleClose(); }}>Delete</SecondaryButton>
        </DialogActions>
      </Dialog>
    </div>
  );
}
