/* eslint-disable @typescript-eslint/no-misused-promises */
import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useSelector } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { useParams } from 'react-router-dom';
import SecondaryButton from 'shared-components/components/SecondaryButton';
import HookSelectField from 'shared-components/hooks/HookSelectField';
import { decrypt } from 'shared-components/hooks/useEncryption';
import type { RootState } from 'mainStore';
import type { SelectOption } from 'types';
import type { IFormValues } from 'formsTypes';
import type { ISaveYardiPayload } from 'admin/AdminFormTypes';
import type { IYardiConnectionType } from './types';

interface IDialogProps {
  open: boolean;
  handleClose: () => void;
  saveYardiBuilding: (data: ISaveYardiPayload) => void;
  connectionTypes: IYardiConnectionType[];
}

const propertyDefaultValue = {
  property_id: 0,
  yardi_code: '',
};

const propertySchema = yup.object().shape({
  property_id: yup.number(),
  yardi_code: yup.string().required('Please select property'),
});

export default function YardiPropertyDialog({
  open, handleClose, connectionTypes, saveYardiBuilding,
}: IDialogProps): JSX.Element {
  const [options, setOptions] = useState<SelectOption[]>([]);
  const buildingIntegration = useSelector((state: RootState) => state.workspaces.buildingIntegration);
  const { buildingId } = useParams();
  useEffect(() => {
    const tranformedOptions = connectionTypes.map((singleType: IYardiConnectionType) => ({
      name: `${singleType.yardi_code} ${singleType.address}`,
      value: singleType.yardi_code,
    }));
    setOptions(tranformedOptions);
  }, [connectionTypes]);

  const {
    control, handleSubmit, formState, reset,
  } = useForm<IFormValues>({
    mode: 'onChange',
    defaultValues: propertyDefaultValue,
    resolver: yupResolver(propertySchema),
  });
  const { errors } = formState;

  const onSubmit: SubmitHandler<ISaveYardiPayload> = (data: ISaveYardiPayload): void => {
    const payload = { ...data };
    payload.property_id = Number(decrypt(buildingId));
    saveYardiBuilding(payload);
    reset(propertyDefaultValue);
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
          <h3 className='dialog-heading'>
            {' '}
            Select Property (
            {buildingIntegration.yardi_servername}
            )
            {' '}
          </h3>
        </DialogTitle>
        <DialogContent>
          <form id='save-yardi-building' style={{ marginTop: 15 }} onSubmit={handleSubmit(onSubmit)}>
            <HookSelectField
              name='yardi_code'
              label='Select Property'
              control={control}
              options={options}
              errors={errors}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <SecondaryButton className='secondary-btn-secondary' onClick={handleClose}>Cancel</SecondaryButton>
          <SecondaryButton className='secondary-diloag-btn' form='save-yardi-building' type='submit'>Connect</SecondaryButton>
        </DialogActions>
      </Dialog>
    </div>
  );
}
