import * as React from 'react';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';
import { useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import SecondaryButton from 'shared-components/components/SecondaryButton';
import HookTextField from 'shared-components/hooks/HookTextField';
import StradaLoader from 'shared-components/components/StradaLoader';
import type { IFormValues } from 'formsTypes';
import type { IAddInvoiceForm } from 'admin/AdminFormTypes';
import type { Imanagers } from './type';

interface Iprops {
  handleClose: () => void;
  open: boolean;
  managersList: Imanagers[] ;
  editManager: Imanagers;
  managersListId: number;
}
interface Ipayload {

  firstName: string;
  lastName: string;
  email: string;
  token: string | null;

}
export default function EditAddApprover(props: Iprops): JSX.Element {
  const {
    handleClose, open, editManager, managersList, managersListId,
  } = props;
  const approverDefaultValues: IAddInvoiceForm = {
    first_name: '',
    last_name: '',
    email: '',
  };
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const schema = yup.object().shape({
    first_name: yup.string().required('Please enter your first name'),
    last_name: yup.string().required('Please enter your last name'),
    email: yup.string().required('Email is required').email('Please enter valid email'),
  });

  const {
    control, formState, reset, handleSubmit, setValue,
  } = useForm<IFormValues>({
    mode: 'onChange',
    defaultValues: approverDefaultValues,
    resolver: yupResolver(schema),
  });
  React.useEffect(() => {
    setValue('first_name', editManager.firstName, { shouldDirty: true });
    setValue('last_name', editManager.lastName, { shouldDirty: true });
    setValue('email', editManager.email, { shouldDirty: true });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editManager]);
  const { errors } = formState;
  const { mutate, isLoading } = useMutation(async (data: Ipayload[]) => axios({
    url: `api/workspace-invoice-approval/${managersListId}/`,
    method: 'patch',
    data: { managers: [...data] },
  }), {
    onSuccess: async () => {
      await queryClient.invalidateQueries('workspace-invoice-approval').catch()
        .then();
      reset(approverDefaultValues);
      enqueueSnackbar('Approver Updated Succsessfully!');
      handleClose();
    },
    onError: () => {
      enqueueSnackbar('Failed!', { variant: 'error' });
    },
  });

  const onSubmit: SubmitHandler<IAddInvoiceForm> = (data: IAddInvoiceForm) => {
    const filtredManagers: Imanagers[] = managersList.filter((item: Imanagers) => item !== editManager);

    const obj = {
      email: data.email,
      token: null,
      firstName: data.first_name,
      lastName: data.last_name,

    };
    const payload: Ipayload[] = [...filtredManagers, obj];

    mutate(payload);
  };
  /* eslint-disable @typescript-eslint/no-misused-promises */

  return (
    <Dialog
      open={open}
      onClose={handleClose}

    >
      <StradaLoader open={isLoading} />

      <form onSubmit={handleSubmit(onSubmit)}>

        <DialogTitle sx={{ pl: 5 }}>Add New Approver</DialogTitle>

        <DialogContent sx={{ width: 450, pl: 5, pr: 9 }}>
          <Box
            component='div'
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: 300,
              mt: 2,

            }}
          />
          <HookTextField
            name='first_name'
            label='First Name'
            control={control}
            errors={errors}
          />
          <HookTextField
            name='last_name'
            label='Last Name'
            control={control}
            errors={errors}
          />
          <HookTextField
            name='email'
            label='Email'
            control={control}
            errors={errors}
          />
        </DialogContent>
        <DialogActions sx={{ mb: 2, mt: 7 }}>
          <SecondaryButton className='secondary-btn-secondary' onClick={handleClose}> Cancel  </SecondaryButton>
          <SecondaryButton className='secondary-btn-secondary' type='submit'>
            {' '}
            <span style={{ color: '#00cfa1' }}>Save</span>
            {' '}
          </SecondaryButton>

        </DialogActions>
      </form>

    </Dialog>
  );
}
