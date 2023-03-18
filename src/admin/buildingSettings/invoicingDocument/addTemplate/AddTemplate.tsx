/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Grid, Typography, Stack } from '@mui/material';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import './_addTemplate.scss';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import type { AxiosResponse } from 'axios';
import axios from 'axios';
import { useSelector } from 'react-redux';
import type { RootState } from 'mainStore';
import { Country, State } from 'country-state-city';
import { useMutation, useQueryClient, useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import PrimayButton from 'shared-components/components/PrimayButton';
import StradaLoader from 'shared-components/components/StradaLoader';
import HookTextField from 'shared-components/hooks/HookTextField';
import { decrypt } from 'shared-components/hooks/useEncryption';
import DragDrop from 'shared-components/dragDrop/index';
import HookSelectField from 'shared-components/hooks/HookSelectField';
import type { IFormValues } from 'formsTypes';
import type {
  Iinputs, Ipayload, ICSC,
} from './types';
import type { Iresponse, IDetail } from '../types';

interface NewFile extends File {
  preview: string;
}
export default function AddTemplate(): JSX.Element {
  const { tempId } = useParams();
  const currentWorkspace = useSelector(
    (state: RootState) => state.workspaces.currentWorkspace.currentWorkspace,
  );
  const [editingLogoUrl, seteditingLogoUrl] = useState<string>('');
  const [editId, setEditId] = useState<number>(0);
  const [countries, setCountries] = useState<ICSC[]>([]);
  const [states, setStates] = useState<ICSC[]>([]);

  const [uploadFile, setUploadFile] = useState<File>();
  const [fileError, setfileError] = useState<boolean>(false);
  const [logoURL, setLogoURL] = useState<string>('');

  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const { data } = useQuery(
    ['edit/invoicing-document', currentWorkspace.id, tempId],
    async () => axios({
      url: `/api/property-invoice-info/?workspace=${currentWorkspace.id}`,
      method: 'get',
    }),
    {
      enabled: tempId !== 'new',
      select: (res: AxiosResponse<Iresponse>) => res.data.detail,
    },
  );

  const defaultInput: Iinputs = {
    name: '',
    description: '',
    payable_check: '',
    invoice_number: null,
    address: '',
    country: '',
    post_code: '',
    state: '',
    email: '',
  };
  const schema = yup.object().shape({
    name: yup.string().trim().required('Name is Required')
      .matches(/^[aA-zZ\s]+$/, 'This field cannot contain special characters'),
    payable_check: yup.string().trim().required('Payable Name is Required')
      .matches(/^[aA-zZ\s]+$/, 'This field cannot contain special characters'),
    invoice_number: yup.string().required('Invoice Number is Required').nullable(),
    address: yup.string().trim().required('Address is Required'),
    country: yup.string().trim().required('Country is Required'),
    state: yup.string().trim().required('State is Required'),
    post_code: yup.string().trim().required('Zip Code is Required'),
    email: yup.string().required('Enter a valid email').email('Please enter your valid contact email'),
  });
  const {
    control, formState, handleSubmit, setValue, watch,
  } = useForm<IFormValues>({
    mode: 'onChange',
    defaultValues: defaultInput,
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (tempId !== 'new' && data !== undefined) {
      const decryptedId = Number(decrypt(tempId));
      const filteredItem = data.filter((item: IDetail) => item.id === decryptedId);
      seteditingLogoUrl(filteredItem[0].logo_image);
      setEditId(filteredItem[0].id);
      setValue('name', filteredItem[0].template_name, { shouldDirty: true });
      setValue('description', filteredItem[0].description, { shouldDirty: true });
      setValue('payable_check', filteredItem[0].payable_to, { shouldDirty: true });
      setValue('invoice_number', filteredItem[0].invoice_number, { shouldDirty: true });
      setValue('address', filteredItem[0].address, { shouldDirty: true });
      setValue('country', filteredItem[0].country, { shouldDirty: true });
      setValue('state', filteredItem[0].state, { shouldDirty: true });
      setValue('post_code', filteredItem[0].zip, { shouldDirty: true });
      setValue('email', filteredItem[0].for_inquiries, { shouldDirty: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tempId, currentWorkspace.id, data]);

  const { mutate: addTemplate, isLoading: addTemplateLoader } = useMutation(async (addData: Ipayload) => axios({
    url: `/api/property-invoice-info/?workspace=${currentWorkspace.id}`,
    method: 'post',
    data: addData,
  }), {
    onSuccess: async () => {
      await queryClient.invalidateQueries('get/invoicing-document').catch()
        .then();
      window.history.back();
      enqueueSnackbar('Saved Successfully');
    },
    onError: (): void => {
      enqueueSnackbar('The Template name must be unique.', { variant: 'error' });
    },
  });

  const { mutate: editTemplate, isLoading: editTemplateLoader } = useMutation(async (dataArg: Ipayload) => axios({
    url: `/api/property-invoice-info/${editId}/`,
    method: 'patch',
    data: dataArg,
  }), {
    onSuccess: async () => {
      await queryClient.invalidateQueries('get/invoicing-document').catch()
        .then();
      window.history.back();
      enqueueSnackbar('Template Updated Successfully');
    },
    onError: (): void => {
      enqueueSnackbar('Request failed', { variant: 'error' });
    },
  });

  const { mutate: fileUpload, isLoading: fileUploadLoader } = useMutation(async (dataArg: FormData) => axios({
    url: '/api/property-invoice-info/upload_invoice_logo_image/',
    method: 'post',
    data: dataArg,
  }), {
    onSuccess: (res) => {
      const logoImg: string = res.data.result.filename;
      setLogoURL(logoImg);
    },
  });
  const { errors } = formState;

  const onSubmit: SubmitHandler<IFormValues> = (paylaodData: IFormValues) => {
    if (uploadFile === undefined && tempId === 'new') {
      setfileError(true);
      return;
    }
    const payload: Ipayload = {
      template_name: paylaodData.name,
      description: paylaodData.description,
      logo_image: logoURL,
      payable_to: paylaodData.payable_check,
      address: paylaodData.address,
      state: paylaodData.state,
      zip: paylaodData.post_code,
      country: paylaodData.country,
      for_inquiries: paylaodData.email,
      invoice_number: paylaodData.invoice_number,
      workspace: currentWorkspace.id,
    };
    if (tempId === 'new') {
      addTemplate(payload);
    } else {
      editTemplate(payload);
    }
  };
  const fileHandler: (file: NewFile) => void = (file: File) => {
    setUploadFile(file);
    const formData = new FormData();

    formData.append('file', file);
    fileUpload(formData);
    setfileError(false);
  };
  const country = watch('country');
  useEffect(() => {
    const selectedCountries = Country.getAllCountries().map((c) => ({
      name: c.name,
      value: c.name,
      code: c.isoCode,
    }));
    setCountries(selectedCountries);
  }, []);
  useEffect(() => {
    const countryCode = countries.filter((c) => c.name === watch('country'))[0]?.code;
    if (countryCode) {
      const filteredStates = State.getStatesOfCountry(countryCode).map((ci) => ({
        name: ci.name,
        value: ci.name,
        code: ci.isoCode,
      }));
      setStates(filteredStates);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [country, watch]);

  const checkFileSelected: () => void = () => {
    if (uploadFile === undefined && tempId === 'new') {
      setfileError(true);
    }
  };
  /* eslint-disable @typescript-eslint/no-misused-promises */
  return (
    <div className='add-template-container'>
      <StradaLoader open={addTemplateLoader || editTemplateLoader || fileUploadLoader} />
      <Stack spacing={1} direction='row' className='stack-header'>
        <div
          className='back-div'
        >
          {' '}
          <ArrowBackIcon
            className='back-icon'
            onClick={(): void => {
              window.history.back();
            }}
          />
        </div>
        {tempId === 'new' ? <Typography className='template-heading'>Add Template</Typography> : <Typography className='template-heading'>Update Template</Typography>}

      </Stack>

      <form onSubmit={handleSubmit(onSubmit)}>

        <Grid container>
          <Grid item sm={12} md={12}>
            <HookTextField
              name='name'
              label='Name'
              control={control}
              errors={errors}
            />
          </Grid>

          <Grid item sm={12} md={12} mt={0.7}>
            <HookTextField
              name='description'
              label='Description(Optional)'
              control={control}
              errors={errors}
            />
          </Grid>
          <Grid item sm={12} md={12} mt={0.7}>
            <DragDrop fileCallback={fileHandler} isEditing={tempId} editingLogoUrl={editingLogoUrl} />
            {fileError && <Typography className='upload-error'>Logo image is Required</Typography>}
          </Grid>

          <Grid item sm={12} md={12} mt={3}>
            <HookTextField
              name='payable_check'
              label='Make check payable to'
              control={control}
              errors={errors}

            />
          </Grid>
          <Grid item sm={12} md={12} mt={0.7}>
            <HookTextField
              name='invoice_number'
              label='Start with Number'
              control={control}
              errors={errors}
              type='number'
            />
          </Grid>
          <Grid item sm={12} md={12} mt={1}>
            <Typography className='invoice-form-sub-heading'>Remittance Address</Typography>
          </Grid>
          <Grid item sm={12} md={12} mt={0.7}>
            <HookTextField
              name='address'
              label='address'
              control={control}
              errors={errors}
            />
          </Grid>
          <Grid container columnSpacing={2} mt={1.5}>
            <Grid item sm={12} md={4}>
              <HookSelectField
                name='state'
                label='State/Territory'
                control={control}
                errors={errors}
                options={states}
              />
            </Grid>
            <Grid item sm={12} md={4}>
              <HookTextField
                name='post_code'
                label='Postcode'
                control={control}
                errors={errors}
              />
            </Grid>

            <Grid item sm={12} md={4}>
              <HookSelectField
                name='country'
                label='Country'
                control={control}
                errors={errors}
                options={countries}
              />
            </Grid>
          </Grid>
          <Grid item sm={12} md={12} mt={2}>
            <Typography className='invoice-form-sub-heading'>For Inquiries</Typography>
          </Grid>
          <Grid item sm={12} md={12} mt={1}>
            <HookTextField
              name='email'
              label='Contact email'
              control={control}
              errors={errors}
            />
          </Grid>
        </Grid>
        <Grid className='d-flex justify-content-end' my={3}>
          <div>
            <PrimayButton type='submit' onClick={(): void => { checkFileSelected(); }}>
              {tempId === 'new' ? 'Save Template' : 'Update Template'}
            </PrimayButton>
          </div>
        </Grid>

      </form>

    </div>

  );
}
