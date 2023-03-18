/* eslint-disable @typescript-eslint/no-misused-promises */
import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import SecondaryButton from 'shared-components/components/SecondaryButton';
import HookTextField from 'shared-components/hooks/HookTextField';
import HookSelectField from 'shared-components/hooks/HookSelectField';
import { decrypt } from 'shared-components/hooks/useEncryption';
import type { IFormValues } from 'formsTypes';
import type { IYardiCredentials } from 'admin/AdminFormTypes';

interface IDialogProps {
  open: boolean;
  handleClose: () => void;
  connectYardi: (data: IYardiCredentials) => void;
}

const yardiDefaultValues = {
  property_id: 0,
  status: 'connecting',
  version: null,
  yardi_code: '',
  yardi_database: 'afqoml_itf70dev7',
  yardi_password: '163985ws',
  yardi_platform: 'Sql Server',
  yardi_servername: 'afqoml_itf70dev7',
  yardi_url: 'https://www.yardipcv.com/8223tp7s7dev/',
  yardi_username: 'stradaws',
};

const platformOptions = [
  {
    name: 'Sql Server',
    value: 'Sql Server',
  },
  {
    name: 'Oracle',
    value: 'Oracle',
  },
];

const yardiSchema = yup.object().shape({
  yardi_username: yup.string().required('Please enter username').matches(/^\s*\S[^]*$/, 'This field contains spaces'),
  yardi_password: yup.string().required('Please enter your password'),
  yardi_servername: yup.string().required('Please enter servername').matches(/^\s*\S[^]*$/, 'This field contains spaces'),
  yardi_database: yup.string().required('Please enter database name').matches(/^\s*\S[^]*$/, 'This field contains spaces'),
  yardi_platform: yup.string().required('Please select plateform'),
  yardi_url: yup.string().required('Please enter url'),
});

export default function YardiDialog({ open, handleClose, connectYardi }: IDialogProps): JSX.Element {
  const { buildingId } = useParams();
  const {
    handleSubmit, control, formState,
  } = useForm<IFormValues>({
    mode: 'onChange',
    defaultValues: yardiDefaultValues,
    resolver: yupResolver(yardiSchema),
  });
  const { errors } = formState;
  const onSubmit = (data: IYardiCredentials): void => {
    const payload = { ...data };
    payload.property_id = Number(decrypt(buildingId));
    connectYardi(payload);
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
          <h3 className='dialog-heading'> Connect Yardi </h3>
        </DialogTitle>
        <DialogContent>
          <form id='yardi-form' className='yard-form-wrapper' onSubmit={handleSubmit(onSubmit)}>
            <HookTextField
              control={control}
              errors={errors}
              label='Username'
              name='yardi_username'
            />
            <HookTextField
              control={control}
              errors={errors}
              label='Password'
              type='password'
              name='yardi_password'
            />
            <HookTextField
              control={control}
              errors={errors}
              label='Server Name'
              name='yardi_servername'
            />
            <HookTextField
              control={control}
              errors={errors}
              label='Database'
              name='yardi_database'
            />
            <HookSelectField
              control={control}
              errors={errors}
              name='yardi_platform'
              label='Platform'
              options={platformOptions}
            />
            <HookTextField
              control={control}
              errors={errors}
              label='Url'
              name='yardi_url'
            />

          </form>
        </DialogContent>
        <DialogActions>
          <SecondaryButton className='secondary-btn-secondary' onClick={handleClose}>Cancel</SecondaryButton>
          <SecondaryButton type='submit' form='yardi-form' className='secondary-diloag-btn'>Connect</SecondaryButton>
        </DialogActions>
      </Dialog>
    </div>
  );
}
