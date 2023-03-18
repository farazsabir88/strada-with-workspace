import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import PrimayButton from 'shared-components/components/PrimayButton';
import SecondaryButton from 'shared-components/components/SecondaryButton';
import StradaLoader from 'shared-components/components/StradaLoader';
import type { Ibuilding } from 'types';
import { useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { useSnackbar } from 'notistack';

interface IDialogProps {
  open: boolean;
  dataToDelete: Ibuilding | null;
  handleClose: () => void;
}

export default function DeleteBuildingDialog({ open, handleClose, dataToDelete }: IDialogProps): JSX.Element {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate: deleteBuilding, isLoading: deletingBuilding } = useMutation(async () => axios({
    url: `/api/building/${dataToDelete?.id}/`,
    method: 'DELETE',
  }), {
    onSuccess: async (): Promise<void> => {
      enqueueSnackbar('Building deleted successfully');
      await queryClient.invalidateQueries('get/buildings').then();
    },
    onError: () => {
      enqueueSnackbar('Building deleting failed', { variant: 'error' });
    },
  });

  const handleDelete = (): void => {
    deleteBuilding();
    handleClose();
  };

  return (
    <div>
      <StradaLoader open={deletingBuilding} message='Delete in progress' />
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth='xs'
        PaperProps={{
          style: {
            minWidth: '530px',
          },
        }}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>
          <h3 className='dialog-heading'> Delete building </h3>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            You will loose all events and documents. This can&#39;t be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <SecondaryButton className='secondary-btn-secondary' onClick={handleClose}>Cancel</SecondaryButton>
          <div style={{ minWidth: '64px', marginLeft: '10px' }}>
            <PrimayButton disabled={deletingBuilding} onClick={handleDelete}>Delete</PrimayButton>
          </div>

        </DialogActions>
      </Dialog>
    </div>
  );
}
