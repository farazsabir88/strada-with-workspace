/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-misused-promises */
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Grid, Typography, Button } from '@mui/material';
import { useSnackbar } from 'notistack';
import _ from 'lodash';
import axios from 'axios';
import { Country, State, City } from 'country-state-city';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from 'react-query';
import StradaLoader from 'shared-components/components/StradaLoader';
import type { IDetailForm } from 'admin/AdminFormTypes';
import type { IFormValues } from 'formsTypes';
import HookTextField from 'shared-components/hooks/HookTextField';
// import Sidebar from 'admin/sidebar';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HookSelectField from 'shared-components/hooks/HookSelectField';
import PrimayButton from 'shared-components/components/PrimayButton';
import type { ICSC } from 'admin/buildingSettings/buildings/types';
import { useSelector } from 'react-redux';
import type { RootState } from 'mainStore';

const defaultValues: IDetailForm = {
  address: '',
  country: '',
  state: '',
  city: '',
  company: '',
  zip: '',
  contact_first_name: '',
  contact_last_name: '',
  contact_email: '',
};

const schema = yup.object().shape({
  address: yup.string().required('This field is required').matches(/^\s*\S[^]*$/, 'This field is required'),
  country: yup.string().required('This field is required').matches(/^\s*\S[^]*$/, 'This field is required'),
  state: yup.string().required('Please select state'),
  city: yup.string().required('Please select city'),
  company: yup.string().required('This field is required').matches(/^\s*\S[^]*$/, 'This field is required'),
  zip: yup.string().required('This field is required').matches(/^\s*\S[^]*$/, 'This field is required'),
  contact_first_name: yup.string().required('This field is required').matches(/^\s*\S[^]*$/, 'This field is required').matches(/^[a-zA-Z0-9]+$/, 'This field cannot contain special character'),
  contact_last_name: yup.string().required('This field is required').matches(/^\s*\S[^]*$/, 'This field is required').matches(/^[a-zA-Z0-9]+$/, 'This field cannot contain special character'),
  contact_email: yup.string().required('This field is required').email('Please enter your valid contact email').matches(/^\s*\S[^]*$/, 'This field is required'),
});

export default function CreateBuilding(): JSX.Element {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const currentWorkspace = useSelector(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    (state: RootState) => state.workspaces.currentWorkspace.currentWorkspace,
  );
  const [countries, setCountries] = useState<ICSC[]>([]);
  const [states, setStates] = useState<ICSC[]>([]);
  const [cities, setCities] = useState<ICSC[]>([]);

  const { mutate, isLoading } = useMutation(async (data: IDetailForm) => axios({
    url: `api/building/?workspace=${currentWorkspace.id}`,
    method: 'POST',
    data,
  }), {
    onSuccess: async () => {
      await queryClient.invalidateQueries('get/buildings').then();
      enqueueSnackbar('Created Successfully');
      navigate('/workspace/settings/buildings');
    },
  });

  const {
    control, formState, handleSubmit, watch, setValue,
  } = useForm<IFormValues>({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const country = watch('country');
  const state = watch('state');

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
      setCities([]);
      setValue('state', '', { shouldDirty: true });
      setValue('city', '', { shouldDirty: true });
    } else {
      setStates([]);
      setCities([]);
    }
  }, [country]);

  useEffect(() => {
    const stateCode = states.filter((st) => st.name === watch('state'))[0]?.code;
    const countryCode = countries.filter((c) => c.name === watch('country'))[0]?.code;
    if (stateCode && countryCode) {
      const filterdCities = City.getCitiesOfState(countryCode, stateCode).map((cty) => ({
        name: cty.name,
        value: cty.name,
        code: cty.stateCode,
      }));
      setCities(filterdCities);
      setValue('city', '', { shouldDirty: true });
    } else {
      setCities([]);
    }
  }, [state, states]);

  const { errors } = formState;
  const formAllErrorsCheck = _.isEmpty(errors);

  const onSubmit = (data: IDetailForm): void => {
    mutate(data);
  };

  const handleCancel = (): void => {
    window.history.back();
    // navigate('/dashboard');
  };

  return (
    <div style={{ display: 'flex', marginTop: '72px' }}>
      {/* <Sidebar variant='main' activeLink='' /> */}
      <StradaLoader open={isLoading} />
      <Grid
        container
        justifyContent='center'
        ml={-3}
        className='mt-4'
      >
        <Grid item sm={12} md={6}>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container columnSpacing={2}>
              <Grid item sm={12} className='mb-4 fw-normal d-flex align-items-center' style={{ color: 'rgba(33, 33, 33, 0.87)', fontSize: '22px' }}>
                <div aria-hidden='true' onClick={(): void => { window.history.back(); }} className='cursor-pointer me-2'>
                  <ArrowBackIcon />
                  {' '}
                </div>
                Create Building
              </Grid>
              <Grid item className='fw-normal fs-6 mb-3'>  Business Address</Grid>
              <Grid item sm={12}>
                <HookTextField
                  name='address'
                  label='Address'
                  control={control}
                  errors={errors}
                />
              </Grid>

              <Grid item sm={12}>
                <HookSelectField
                  name='country'
                  label='Country'
                  control={control}
                  errors={errors}
                  options={countries}
                />
              </Grid>

              <Grid item sm={12} md={6}>
                <HookSelectField
                  name='state'
                  label='State'
                  control={control}
                  errors={errors}
                  options={states}
                />
              </Grid>
              <Grid item sm={12} md={6}>
                <HookTextField
                  name='zip'
                  label='Post Code'
                  control={control}
                  errors={errors}
                />
              </Grid>
              <Grid item sm={12} md={12}>
                <HookSelectField
                  name='city'
                  label='City'
                  control={control}
                  errors={errors}
                  options={cities}
                />
              </Grid>
              <Grid item sm={12} md={12}>
                <HookTextField
                  name='company'
                  label='Company'
                  control={control}
                  errors={errors}
                />
              </Grid>

              <Grid item sm={12} md={12}>
                <h6 className='building-settings-detail-sub-heading'> Contact Person  </h6>
              </Grid>

              <Grid item sm={12} md={6}>
                <HookTextField
                  name='contact_first_name'
                  label='First Name'
                  control={control}
                  errors={errors}
                />
              </Grid>
              <Grid item sm={12} md={6}>
                <HookTextField
                  name='contact_last_name'
                  label='Last Name'
                  control={control}
                  errors={errors}
                />
              </Grid>
              <Grid item sm={12} md={12}>
                <HookTextField
                  name='contact_email'
                  label='Email'
                  control={control}
                  errors={errors}
                />
              </Grid>
              <Grid item sm={12} md={12} justifyContent='right'>
                {!formAllErrorsCheck && <Typography className='error-message d-flex flex-row-reverse'>All fields are required</Typography>}
                <div className='action-btn'>
                  <Button variant='text' className='me-3 text-capitalize' onClick={handleCancel}> Cancel </Button>
                  <PrimayButton type='submit'> Create </PrimayButton>
                </div>
              </Grid>
            </Grid>

          </form>
        </Grid>
      </Grid>
    </div>

  );
}
