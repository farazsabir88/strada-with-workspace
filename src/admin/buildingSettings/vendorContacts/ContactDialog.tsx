/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-misused-promises */
import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Grid } from '@mui/material';
import { useSelector } from 'react-redux';
import { useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import SecondaryButton from 'shared-components/components/SecondaryButton';
import HookTextField from 'shared-components/hooks/HookTextField';
import type { RootState } from 'mainStore';
import type { IFormValues } from 'formsTypes';
import type { IContactDialog } from 'admin/AdminFormTypes';
import StradaLoader from 'shared-components/components/StradaLoader';
import { useSnackbar } from 'notistack';
import type { IContactAction } from './types';

interface IDialogProps {
  open: boolean;
  handleClose: () => void;
  action: IContactAction;
}

const StyledTitle = styled(DialogTitle)`
h3{
    font-size: 1.25rem !important;
    font-family: "Roboto-Medium";
    font-weight: 500 !important;
    line-height: 1.6 !important;
    letter-spacing: 0.0075em !important;
}
`;

const contactFormDefaults: IContactDialog = {
  company: '',
  created_at: '',
  email: '',
  id: 0,
  job: '',
  name: '',
  notes: '',
  phone: '',
  property: 0,
  surname: '',
  updated_at: '',
};
// const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
const contactSchema = yup.object().shape({
  company: yup.string(),
  created_at: yup.string(),
  email: yup.string().email('Please enter a valid email').required('Please enter your email'),
  name: yup.string().required('Please enter your name').matches(/^\s*\S[^]*$/, 'This field is required'),
  surname: yup.string().required('Please enter your last name').matches(/^\s*\S[^]*$/, 'This field is required'),
  phone: yup.string().optional().matches(
    /^(\s*|\d+)$/,
    'Enter a valid phone number',
  ),
});

export default function ContactDilaog({ open, handleClose, action }: IDialogProps): JSX.Element {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const currentBuilding = useSelector((state: RootState) => state.workspaces.currentBuilding);
  const user = useSelector((state: RootState) => state.auth.user);
  const {
    control, handleSubmit, formState, reset, setValue,
  } = useForm<IFormValues>({
    mode: 'onChange',
    defaultValues: contactFormDefaults,
    resolver: yupResolver(contactSchema),
  });
  const { errors } = formState;

  const { mutate, isLoading: creatingContact } = useMutation(async (payload: IContactDialog) => axios({
    url: '/api/vendor-contact/',
    method: 'POST',
    data: payload,
  }), {
    onSuccess: async () => {
      await queryClient.invalidateQueries('get/vendor-contacts').catch()
        .then();
      reset(contactFormDefaults);
      handleClose();
      enqueueSnackbar('Contact created successfully');
    },
  });

  const { mutate: updateContact, isLoading: updatingContact } = useMutation(async (payload: IContactDialog) => axios({
    url: `/api/vendor-contact/${payload.id}/`,
    method: 'PATCH',
    data: payload,
  }), {
    onSuccess:
      async () => {
        await queryClient.invalidateQueries('get/vendor-contacts').catch()
          .then();
        reset(contactFormDefaults);
        handleClose();
        enqueueSnackbar('Contact updated successfully');
      },
  });

  const onSubmit: (data: IContactDialog) => void = (data: IContactDialog) => {
    if (action.type === 'edit') {
      const updateContactPayload = {
        ...data,
        property: currentBuilding.id,
      };
      updateContact(updateContactPayload);
    } else {
      const newContactPayload = {
        ...data,
        id: user.id,
        property: currentBuilding.id,
      };
      mutate(newContactPayload);
    }
  };

  React.useEffect(() => {
    if (action.type === 'edit') {
      if (action.data !== undefined) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        setValue('company', action.data.company, { shouldDirty: true });
        setValue('created_at', action.data.created_at, { shouldDirty: true });
        setValue('email', action.data.email, { shouldDirty: true });
        setValue('id', action.data.id, { shouldDirty: true });
        setValue('name', action.data.name, { shouldDirty: true });
        setValue('job', action.data.job, { shouldDirty: true });
        setValue('notes', action.data.notes, { shouldDirty: true });
        setValue('phone', action.data.phone, { shouldDirty: true });
        setValue('property', action.data.property, { shouldDirty: true });
        setValue('surname', action.data.surname, { shouldDirty: true });
        setValue('updated_at', action.data.updated_at, { shouldDirty: true });
      }
    } else {
      reset(contactFormDefaults);
    }
  }, [action, open]);

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
        <StyledTitle id='alert-dialog-title'>
          <h3> Contact us </h3>
        </StyledTitle>
        <DialogContent>
          <form id='contact-add-form' style={{ marginTop: '5px' }} onSubmit={handleSubmit(onSubmit)}>
            <StradaLoader open={creatingContact || updatingContact} message='Action in progress' />
            <Grid container columnSpacing={2}>
              <Grid item md={6}>
                <HookTextField
                  name='name'
                  label='First Name'
                  control={control}
                  errors={errors}
                />
              </Grid>
              <Grid item md={6}>
                <HookTextField
                  name='surname'
                  label='Last Name'
                  control={control}
                  errors={errors}
                />
              </Grid>
              <Grid item md={6}>
                <HookTextField
                  name='company'
                  label='Vendor'
                  control={control}
                  errors={errors}
                />
              </Grid>
              <Grid item md={6}>
                <HookTextField
                  name='job'
                  label='Job'
                  control={control}
                  errors={errors}
                />
              </Grid>
              <Grid item sm={12}>
                <HookTextField
                  name='email'
                  label='Email'
                  control={control}
                  errors={errors}
                />
              </Grid>
              <Grid item sm={12}>
                <HookTextField
                  name='phone'
                  label='Phone'
                  control={control}
                  errors={errors}
                  // type='number'
                />
              </Grid>
              <Grid item sm={12}>
                <HookTextField
                  name='notes'
                  label='Notes'
                  control={control}
                  errors={errors}
                />
              </Grid>

            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <SecondaryButton className='secondary-btn-secondary' onClick={handleClose}>Cancel</SecondaryButton>
          <SecondaryButton type='submit' form='contact-add-form' className='secondary-diloag-btn'>Save</SecondaryButton>
        </DialogActions>
      </Dialog>
    </div>
  );
}
