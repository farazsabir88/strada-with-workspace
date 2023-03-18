/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-misused-promises */
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Grid, Typography, Button } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { Country, State, City } from 'country-state-city';
import { useMutation } from 'react-query';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import _ from 'lodash';
import HookTextField from 'shared-components/hooks/HookTextField';
import StradaLoader from 'shared-components/components/StradaLoader';
import type { IFormValues } from 'formsTypes';
import type { IDetailForm } from 'admin/AdminFormTypes';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SelectInput from 'shared-components/inputs/SelectInput';
import makeStyles from '@mui/styles/makeStyles';
import type { ICSC, IViewBuildingData } from '../types';

const useStyles = makeStyles(() => ({
  errorText: {
    fontWeight: '400',
    fontSize: '0.75rem',
    lineHeight: '1.66',
    letterSpacing: '0.03333 rem',
    textAlign: 'left',
    marginTop: '3px',
    marginRight: '14px',
    marginLeft: '14px',
    marginBottom: '20px',
  },
  noMarignBottom: {
    marginBottom: '0px !important',
  },
}));

const detailFormDefaultValues: IDetailForm = {
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
  address: yup.string().required('This field is required'),
  country: yup.string().required('This field is required').matches(/^\s*\S[^]*$/, 'This field is required'),
  // state: yup.string().required('Please select state'),
  // city: yup.string().required('Please select city'),
  company: yup.string().required('This field is required').matches(/^\s*\S[^]*$/, 'This field is required'),
  zip: yup.string().required('This field is required').matches(/^\s*\S[^]*$/, 'This field is required'),
  contact_first_name: yup.string().required('This field is required'),
  contact_last_name: yup.string().required('This field is required').matches(/^\s*\S[^]*$/, 'This field is required'),
  contact_email: yup.string().required('This field is required').email('Please enter your valid contact email').matches(/^\s*\S[^]*$/, 'This field is required'),
});

export default function EditBuilding(): JSX.Element {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  const buildingData = useLocation().state as IViewBuildingData;
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [countries, setCountries] = useState<ICSC[]>([]);
  const [states, setStates] = useState<ICSC[]>([]);
  const [cities, setCities] = useState<ICSC[]>([]);

  // use query setup

  const { mutate, isLoading } = useMutation(async (data: IDetailForm) => axios({
    url: `api/building/${buildingData.id}/`,
    method: 'PUT',
    data,
  }), {
    onSuccess: () => {
      enqueueSnackbar('Saved Successfully');
      navigate('/workspace/settings/buildings');
    },
  });

  const {
    control, formState, watch, setValue, handleSubmit, getValues,
  } = useForm<IFormValues>({
    mode: 'onChange',
    defaultValues: detailFormDefaultValues,
    resolver: yupResolver(schema),
  });

  const country = watch('country');
  const state = watch('state');
  watch('city');
  const { errors } = formState;
  const formAllErrorsCheck = _.isEmpty(errors);

  useEffect(() => {
    const selectedCountries = Country.getAllCountries().map((c) => ({
      name: c.name,
      value: c.name,
      code: c.isoCode,
    }));
    setCountries(selectedCountries);
  }, []);

  useEffect(() => {
    setValue('city', buildingData.city, { shouldDirty: true });
    setValue('address', buildingData.address, { shouldDirty: true });
    setValue('company', buildingData.company, { shouldDirty: true });
    setValue('state', buildingData.state, { shouldDirty: true });
    setValue('zip', buildingData.zip, { shouldDirty: true });
    setValue('contact_first_name', buildingData.contact_first_name, { shouldDirty: true });
    setValue('contact_last_name', buildingData.contact_last_name, { shouldDirty: true });
    setValue('contact_email', buildingData.contact_email, { shouldDirty: true });
    setValue('country', buildingData.country, { shouldDirty: true });
  }, [buildingData, setValue]);

  useEffect(() => {
    const countryCode = countries.filter((c) => c.name === watch('country'))[0]?.code;
    if (countryCode) {
      const filteredStates = State.getStatesOfCountry(countryCode).map((ci) => ({
        name: ci.name,
        value: ci.name,
        code: ci.isoCode,
      }));
      setStates(filteredStates);
    } else {
      setStates([]);
      setCities([]);
    }
  }, [country, watch]);

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
    } else {
      setCities([]);
    }
  }, [state, country, states]);

  const triggerCountryChange = (): void => {
    setValue('state', '', { shouldDirty: true });
    setValue('city', '', { shouldDirty: true });
  };

  const triggerStateChange = (): void => {
    setValue('city', '', { shouldDirty: true });
  };

  const handleCityChange = (type: string, e: SelectChangeEvent): void => {
    setValue('city', e.target.value);
  };

  const handleCountryChange = (type: string, e: SelectChangeEvent): void => {
    setValue('country', e.target.value);

    triggerCountryChange();
  };

  const handleStateChange = (type: string, e: SelectChangeEvent): void => {
    setValue('state', e.target.value);
    triggerStateChange();
  };

  const onSubmit = (data: IDetailForm): void => {
    mutate(data);
  };

  return (
    <div style={{ marginTop: '72px' }}>
      <StradaLoader open={isLoading} message='Updating' />
      <Grid
        container
        justifyContent='center'
        ml={-3}
      >
        <Grid item sm={12} md={7}>
          <div className='d-flex align-items-center mt-4'>
            <div aria-hidden='true' onClick={(): void => { window.history.back(); }} className='cursor-pointer'>
              <ArrowBackIcon />
              {' '}
            </div>
            <h5 className='edit-building-heading'>{`Edit ${buildingData.address}`}</h5>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>

            <Grid container columnSpacing={2}>
              <Grid item>
                <div className='detail-main-wrapper'>
                  <h6 className='building-settings-detail-heading'> Business Address  </h6>
                </div>
              </Grid>

              <Grid item sm={12}>
                <HookTextField
                  name='address'
                  label='Address'
                  control={control}
                  errors={errors}
                />
              </Grid>

              <Grid item sm={12}>
                <SelectInput
                  name='country'
                  label='Country'
                  error={Boolean(getValues('country') === '' && _.get(errors, 'country')?.message)}
                  value={getValues('country').toString()}
                  onChange={(e): void => { handleCountryChange('country', e); }}
                  haveMarginBottom={getValues('country') !== ''}
                  options={countries}
                />
                {getValues('country') === '' && (
                  <p className={`text-danger ${classes.errorText}`}>
                    {_.get(errors, 'country')?.message}
                  </p>
                )}
              </Grid>

              <Grid item sm={12} md={6}>
                <SelectInput
                  name='state'
                  label='State'
                  value={getValues('state') !== '' ? getValues('state').toString() : ''}
                  onChange={(e): void => { handleStateChange('state', e); }}
                  // error={Boolean(getValues('state') === '' && _.get(errors, 'state')?.message)}
                  options={states}
                  haveMarginBottom={false}
                />
                {/* {getValues('state') === '' && (
                  <p className={`text-danger ${classes.errorText}`}>
                    {_.get(errors, 'state')?.message}
                  </p>
                )} */}
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
                <SelectInput
                  name='city'
                  label='City'
                  value={getValues('city') !== '' ? getValues('city').toString() : ''}
                  onChange={(e): void => { handleCityChange('city', e); }}
                  // error={Boolean(getValues('city') === '' && _.get(errors, 'city')?.message)}
                  options={cities}
                />
                {/* {getValues('city') === '' && (
                  <p className={`text-danger ${classes.errorText}`}>
                    {_.get(errors, 'city')?.message}
                  </p>
                )} */}
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
                  <Button
                    variant='contained'
                    onClick={(): void => { window.history.back(); }}
                    style={{
                      textTransform: 'inherit', color: 'white', background: '#00CFA1', marginRight: '15px',
                    }}
                    color='primary'
                  >
                    {' '}
                    Cancel
                    {' '}
                  </Button>
                  <Button
                    variant='contained'
                    type='submit'
                    style={{
                      textTransform: 'inherit', color: 'white', background: '#00CFA1',
                    }}
                    color='primary'
                  >
                    {' '}
                    Save Details
                    {' '}
                  </Button>
                </div>
              </Grid>
            </Grid>
          </form>
        </Grid>

      </Grid>
    </div>
  );
}
