import * as React from 'react';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContentText from '@mui/material/DialogContentText';
import { useSnackbar } from 'notistack';
import { useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import NumberTextfield from 'shared-components/inputs/NumberTextfield';
import SecondaryButton from 'shared-components/components/SecondaryButton';
import StradaLoader from 'shared-components/components/StradaLoader';
import type { RootState } from 'mainStore';

interface Imanagers {

  email: string;
  firstName: string;
  lastName: string;
  token: string | null;
}
interface IpropsData {
  id: number;
  threshold: number;
  managers: Imanagers[];
}

interface Iprops {
  handleClose: () => void;
  open: boolean;
  managers: IpropsData[];
}
interface Ipayload {
  threshold: number;
  managers: object;
  is_default: boolean;
}

export default function AddNewThreshold(props: Iprops): JSX.Element {
  const currentWorkspace = useSelector((state: RootState) => state.workspaces.currentWorkspace.currentWorkspace);
  const [addNewThreshold, setAddNewThreshold] = React.useState<number>(Number);
  const { handleClose, open, managers } = props;
  const [error, setError] = React.useState<boolean>(false);
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const thresholdValue: (e: React.ChangeEvent<HTMLInputElement>) => void = (e) => {
    setError(false);
    const val = Math.abs(Number(e.target.value));
    setAddNewThreshold(val);
  };

  const { mutate, isLoading } = useMutation(async (data: Ipayload) => axios({
    url: `/api/workspace-po-approval/?workspace=${currentWorkspace.id}`,
    method: 'post',
    data,
  }), {
    onSuccess: async () => {
      await queryClient.invalidateQueries('workspace-po-approval').catch()
        .then();
      enqueueSnackbar('Threshold Added Succsessfully!');
      handleClose();
    },
    onError: () => {
      enqueueSnackbar('Failed!', { variant: 'error' });
    },
  });

  const handleThresholdValidation: (threshold: number) => boolean = (threshold) => {
    const filteredThreshold = managers.find((manager: IpropsData) => manager.threshold === threshold);
    if (filteredThreshold) {
      return true;
    }
    return false;
  };
  const onSave: () => void = () => {
    const flag: boolean = handleThresholdValidation(addNewThreshold);
    if (flag || addNewThreshold === 0) {
      setError(true);
      return;
    }
    const payload = {
      threshold: addNewThreshold,
      managers: [],
      is_default: false,
    };

    mutate(payload);
    setAddNewThreshold(0);
  };
  return (
    <Dialog
      open={open}
      onClose={handleClose}
    >
      <StradaLoader open={isLoading} />

      <DialogTitle sx={{ mt: 2, pl: 5 }}>Add new Threshold</DialogTitle>
      <DialogContent sx={{ width: 350, pl: 5, pr: 7 }}>
        <DialogContentText sx={{ mb: 2, color: '#212121', fontSize: '15px' }}>
          Enter Threshold value:
        </DialogContentText>
        <Box
          component='div'
          sx={{
            display: 'flex',
            flexDirection: 'column',

          }}
        />
        <NumberTextfield
          type='number'
          name='threshold'
          label='threshold'
          value={addNewThreshold}
          onChange={thresholdValue}
        />
        <div style={{ height: '1.3rem' }}>{error && <Typography pl={0.7} mt={0.5} sx={{ color: 'red', fontSize: '0.7rem' }}>Threshold Value Already Exists</Typography>}</div>

      </DialogContent>
      <DialogActions sx={{ mb: 2 }}>
        <SecondaryButton className='secondary-btn-secondary' onClick={handleClose}> Cancel  </SecondaryButton>
        <SecondaryButton className='secondary-btn-secondary' onClick={onSave}>
          {' '}
          <span style={{ color: '#00cfa1' }}>Save</span>
          {' '}
        </SecondaryButton>
      </DialogActions>
    </Dialog>
  );
}
