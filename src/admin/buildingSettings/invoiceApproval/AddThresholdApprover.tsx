import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import type { AxiosResponse } from 'axios';
import { useSnackbar } from 'notistack';
import { useMutation, useQueryClient, useQuery } from 'react-query';
import axios from 'axios';
import type { RootState } from 'mainStore';
import { useSelector } from 'react-redux';
import SecondaryButton from 'shared-components/components/SecondaryButton';
import HookTextField from 'shared-components/hooks/HookTextField';
import StradaLoader from 'shared-components/components/StradaLoader';
import type { IFormValues } from 'formsTypes';
import type { IAddInvoiceForm } from 'admin/AdminFormTypes';

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

interface IThresholdApproverProps {
  threshold: number;
  id: number;
}

interface Iprops {
  handleClose: () => void;
  open: boolean;
  thresholdApproverPropsData: IThresholdApproverProps;
  managers: IpropsData[];
}
interface Ipayload {
  id: number;
  threshold: number;
  managers: Imanagers[];
  is_default: boolean;
}
// interface IApiCallType {
//   method: number;
//   url: string;
// }
interface IthresholdMap {
  id: number;
  created_at: string;
  updated_at: string;
  threshold: number;
  managers: Imanagers[];
  is_default: boolean;
}
interface IDetail {
  default_approvals: IthresholdMap[];
  thresholds: IthresholdMap[];
  no_invoice_approval: number;
  have_default_approval: boolean;
}
interface IInvoiceApprovalResponse {
  detail: IDetail;
}
export default function AddApprover(props: Iprops): JSX.Element {
  const {
    handleClose, open, thresholdApproverPropsData, managers,
  } = props;
  // const [apiCallType, setApiCallType] = useState<IApiCallType>({ method: 1, url: '' });
  const [InvoiceApprovalData, setInvoiceApprovalData] = useState<IDetail>();
  const currentWorkspace = useSelector((state: RootState) => state.workspaces.currentWorkspace.currentWorkspace);
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
    control, formState, reset, handleSubmit, setError,
  } = useForm<IFormValues>({
    mode: 'onChange',
    defaultValues: approverDefaultValues,
    resolver: yupResolver(schema),
  });
  useQuery(
    'workspace-invoice-approval',
    async () => axios({
      url: `api/workspace-invoice-approval/?workspace=${currentWorkspace.id}`,
      method: 'get',
    }),
    {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      select: (res: AxiosResponse<IInvoiceApprovalResponse>) => res.data.detail,
      onSuccess: (approvalData: IDetail) => {
        setInvoiceApprovalData(approvalData);
      },
    },
  );

  const { errors } = formState;
  const { mutate, isLoading } = useMutation(async (data: Ipayload) => axios({
    url: `api/workspace-invoice-approval/${data.id}/`,
    method: 'PATCH',
    data,
  }), {
    onSuccess: async () => {
      await queryClient.invalidateQueries('workspace-invoice-approval').catch()
        .then();
      reset(approverDefaultValues);
      enqueueSnackbar('Approver Added Succsessfully!');
      handleClose();
    },
    onError: () => {
      enqueueSnackbar('Failed!', { variant: 'error' });
    },
  });
  const handleEmailValidation: (email: string) => boolean = (email) => {
    const filterdData: IpropsData[] = managers.filter((item: IpropsData) => item.threshold === thresholdApproverPropsData.threshold);

    const managersList: Imanagers[] = filterdData[0].managers;
    const checkManagerEmail = managersList.find((item) => item.email === email);
    if (checkManagerEmail) {
      return true;
    }
    return false;
  };
  const onSubmit: SubmitHandler<IAddInvoiceForm> = (data: IAddInvoiceForm) => {
    const flag: boolean = handleEmailValidation(data.email);

    if (flag) {
      setError(
        'email',
        {
          type: 'email',
          message: 'Email Already Exist',
        },
      );
      return;
    }
    const managersObject = {
      firstName: data.first_name,
      lastName: data.last_name,
      email: data.email,
      token: null,
    };
    let managersData: Imanagers[] = [];
    if (InvoiceApprovalData !== undefined) {
      const previousData = InvoiceApprovalData.thresholds.filter((item: IpropsData) => item.id === thresholdApproverPropsData.id);
      managersData = previousData[0].managers;
    } else {
      managersData = [];
    }

    const payload = {
      id: thresholdApproverPropsData.id,
      threshold: thresholdApproverPropsData.threshold,
      managers: [...managersData, managersObject],
      is_default: false,
    };
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

        <DialogContent sx={{
          width: 450, pl: 5, pr: 9,
        }}
        >
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
