/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import './_contactUs.scss';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';
import { Country } from 'country-state-city';
import { Grid, Box } from '@mui/material';
import PrimayButton from 'shared-components/components/PrimayButton';
import HookTextField from 'shared-components/hooks/HookTextField';
import HookSelectField from 'shared-components/hooks/HookSelectField';
import CustomCheckbox from 'shared-components/inputs/CustomCheckbox';
import contactImg from 'assests/images/contact.png';
import addressIcon from 'assests/images/icon-address.png';
import emailIcon from 'assests/images/icon-email.png';
import type { IFormValues } from 'formsTypes';
import { useMutation } from 'react-query';
import axios from 'axios';
import StradaLoader from 'shared-components/components/StradaLoader';
import Footer from '../footer/Footer';
import type { IContactUs } from '../ClientFormTypes';

interface Icountries {
  name: string;
  value: string;
}

const defaultCountries = [{
  name: '',
  value: '',
}];

const ContactDefaultValues: IContactUs = {
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  country: '',
  company: '',
  message: '',
  isAggreed: false,
};

const schema = yup.object().shape({
  first_name: yup.string().required('Please enter your first name'),
  last_name: yup.string().required('Please enter your last name'),
  email: yup.string().required('Please enter your email').email('Enter a valid email'),
  // phone: yup.string().required('Please enter your phone number'),
  phone: yup.string().required('Please enter your phone number').matches(
    /^(\s*|\d+)$/,
    'Please enter a valid phone number',
  ),
  country: yup.string().required('Please select your country'),
  message: yup.string().required('Please enter your message'),
});

export default function ContactUs(): JSX.Element {
  const { enqueueSnackbar } = useSnackbar();
  const [countries, setCountries] = useState<Icountries[]>(defaultCountries);
  const [isSent, setIsSent] = useState(false);
  const [isFailed, setIsFailed] = useState(false);
  const {
    control, formState, handleSubmit, reset,
  } = useForm<IFormValues>({
    mode: 'onChange',
    defaultValues: ContactDefaultValues,
    resolver: yupResolver(schema),
  });

  const { errors } = formState;

  useEffect(() => {
    const selectedCountries = Country.getAllCountries().map((c) => ({
      name: c.name,
      value: c.name,
    }));
    setCountries(selectedCountries);
  }, []);

  const { mutate: contactUs, isLoading } = useMutation(async (data: IContactUs) => axios({
    url: '/api/request_demo/',
    method: 'POST',
    data,
  }), {
    onSuccess: () => {
      enqueueSnackbar('Request is sent.');
      setIsSent(true);
    },
    onError: () => {
      enqueueSnackbar('Request failed.');
      setIsFailed(true);
    },
  });

  const onSubmit = (data: IContactUs): void => {
    // contactUs(data);
    enqueueSnackbar('Request is sent.');
    reset(ContactDefaultValues);
  };

  return (
    <div className='full-width contactus-container '>
      <StradaLoader open={isLoading} />
      <div className='contactus-content full-height flex-col-center'>

        <h1> Drop us a line</h1>

        <Grid container justifyContent='center'>

          <Grid item md={6} sm={8} xs={11}>

            <form onSubmit={handleSubmit(onSubmit)}>

              <Grid container spacing={1}>
                <Grid item xs={12} md={6}>
                  <HookTextField
                    name='first_name'
                    label='First Name'
                    control={control}
                    errors={errors}
                    type='text'
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <HookTextField
                    name='last_name'
                    label='Last Name'
                    control={control}
                    errors={errors}
                    type='text'
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <HookTextField
                    name='email'
                    label='Email'
                    control={control}
                    errors={errors}
                    type='text'
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <HookSelectField
                    name='country'
                    label='Country'
                    control={control}
                    errors={errors}
                    options={countries}
                  />

                </Grid>
                <Grid item xs={12} md={6}>
                  <HookTextField
                    name='phone'
                    label='Phone'
                    control={control}
                    errors={errors}
                    type='text'

                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <HookTextField
                    name='company'
                    label='Company (Optional)'
                    control={control}
                    errors={errors}
                    type='text'
                  />
                </Grid>
                <Grid item xs={12}>
                  <HookTextField
                    name='message'
                    label='Message'
                    control={control}
                    errors={errors}
                    type='text'
                    multiline
                    rows={5}
                  />
                </Grid>
              </Grid>
              <div className='mui-select'>
                {' '}
                <CustomCheckbox name='isAggreed' label='By checking this box, you agree to receive communications from Strada regarding its products and services offerings.' />
              </div>

              <div className='contact-us-button'>
                <PrimayButton className='primary-big-btn' type='submit'> Contact Us</PrimayButton>
              </div>
            </form>

          </Grid>

        </Grid>
        <Grid item md={3} sm={8} xs={11}>
          {isSent && (
            <div className='thank-you-message'>
              Thanks! We’ll  be in contact shortly
            </div>
          )}
          {isFailed && (
            <div className='thank-you-message'>
              Requet failed, Please try again.
            </div>
          )}

        </Grid>

      </div>

      {/* Office Location */}

      <div className='office-location-section contactus-content'>
        <h1> Our Office  </h1>

        <Grid className='office-grid-container' container alignItems='center' justifyContent='center'>
          <Grid item md={4} sm={12}>
            <div className='contacts-box-wrapper'>
              <div className='contacts-list-wrapper'>
                <div className='single-contact'>
                  <div className='icon-wrapper'>
                    <img src={addressIcon} alt='address-icon' />
                  </div>
                  <p> 595 Pacific Avenue San Francisco CA 94133 </p>
                </div>
                <div className='single-contact'>
                  <div className='icon-wrapper'>
                    <img src={emailIcon} alt='address-icon' />
                  </div>
                  <p> contact @strada.ai </p>
                </div>
              </div>
            </div>
          </Grid>
          <Grid item md={8} sm={12}>
            <div className='contact-img-wrapper'>
              <img src={contactImg} alt='contact-map' />
            </div>
          </Grid>

        </Grid>
      </div>
      <Box mt={16}>
        {' '}
        <Footer />
      </Box>

    </div>
  );
}
