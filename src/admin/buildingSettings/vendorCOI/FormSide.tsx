/* eslint-disable no-console */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Autocomplete, Grid, Stack, Button,
} from '@mui/material';
import { useMutation, useQuery } from 'react-query';
import type { AxiosResponse } from 'axios';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useSelector } from 'react-redux';
import type { RootState } from 'mainStore';
import HookTextField from 'shared-components/hooks/HookTextField';
import type { IFormValues } from 'formsTypes';
import HookCheckbox from 'shared-components/hooks/HookCheckbox';
import PrimayButton from 'shared-components/components/PrimayButton';
import { decrypt } from 'shared-components/hooks/useEncryption';
import StradaLoader from 'shared-components/components/StradaLoader';
import type { ISingleVendorCIO, ISingleVendorResponse } from 'admin/AdminFormTypes';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import type { ICOIBuilding, IWorkspaceBuildingResponse } from './types';

const icon = <CheckBoxOutlineBlankIcon fontSize='small' />;
const checkedIcon = <CheckBoxIcon fontSize='small' />;

const cioDefaultValues = {
  id: 0,
  med_exp: 0,
  products_comp: 0,
  property: '',
  personal_adv_injury: 0,
  property_damage_per_accident: 0,
  aggregate: 0,
  bodily_injury_per_accident: 0,
  bodily_injury_per_person: 0,
  building_access_all: false,
  disease_ea_employee: 0,
  disease_policy_limit: 0,
  each_accident: 0,
  each_occurrence: 0,
  each_occurrence_umbrella: 0,
  combined_single_limit: 0,
  damage_to_rented_premises: 0,
  general_aggregate: 0,
  claims_made: true,
  claims_made_umbrella: true,
  any_auto: true,
  anyone_excluded: true,
  can_be_mentioned_in_description: true,
  commercial_general_liability: true,
  ded: true,
  excess_liab: true,
  general_other: true,
  general_other_value: null,
  hired_autos_only: true,
  loc: true,
  must_be_named_certificate_holder: true,
  name: '',
  non_owned_autos_only: true,
  occur: true,
  occur_umbrella: true,
  other: true,
  owned_autos_only: true,
  per_statute: true,
  policy: true,
  project: true,
  retention_value: null,
  scheduled_autos: true,
  umbrella_liab: true,
  category_holders: [],
};

const cioSchema = yup.object().shape({
  name: yup.string().required('Please enter name'),
  med_exp: yup.number().typeError('Please Add Number'),
  products_comp: yup.number().typeError('Please Add Number'),
  personal_adv_injury: yup.number().typeError('Please Add Number'),
  property_damage_per_accident: yup.number().typeError('Please Add Number'),
  aggregate: yup.number().typeError('Please Add Number'),
  bodily_injury_per_accident: yup.number().typeError('Please Add Number'),
  bodily_injury_per_person: yup.number().typeError('Please Add Number'),
  disease_ea_employee: yup.number().typeError('Please Add Number'),
  disease_policy_limit: yup.number().typeError('Please Add Number'),
  each_accident: yup.number().typeError('Please Add Number'),

  each_occurrence: yup.number(),

  each_occurrence_umbrella: yup.number().typeError('Please Add Number'),
  combined_single_limit: yup.number().typeError('Please Add Number'),
  damage_to_rented_premises: yup.number().typeError('Please Add Number'),
  general_aggregate: yup.number().typeError('Please Add Number'),
});

export default function FormSide(): JSX.Element {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { buildingId, cioId } = useParams();
  const currentBuilding = useSelector((state: RootState) => state.workspaces.currentBuilding);
  const currentWorkspace = useSelector((state: RootState) => state.workspaces.currentWorkspace.currentWorkspace);
  const [allProperties, setAllProperties] = useState<boolean>(true);
  const [selectedProperties, setSelectedProperties] = useState<ICOIBuilding[]>([]);
  const [singleVendorCoi, setsingleVendorCoi] = useState<ISingleVendorCIO>();

  const [title, setTitle] = useState('');
  const { isLoading } = useQuery(['get/singleVendorCOI', cioId, buildingId], async () => axios({
    url: `api/workspace-vendor-coi/${decrypt(cioId)}`,
    method: 'get',
  }), {
    select: (res: AxiosResponse<ISingleVendorResponse>) => res.data.detail,
    enabled: cioId !== 'new',
    onSuccess: (res): void => {
      setsingleVendorCoi(res);
    },
  });

  const { data: workspacePropertiesList = [] } = useQuery(['get/builings-in-workspace', currentWorkspace], async () => axios({
    url: `api/filter/property/?workspace=${currentWorkspace.id}`,
    method: 'get',
  }), {
    select: (res: AxiosResponse<IWorkspaceBuildingResponse>) => res.data.detail,
  });

  const { mutate: createNewCOI, isLoading: creating } = useMutation(async (data: ISingleVendorCIO) => axios({
    url: `api/workspace-vendor-coi/?workspace=${currentWorkspace.id}`,
    method: 'post',
    data,
  }), {
    onSuccess: (): void => {
      navigate('/workspace/settings/vendorCOI');
      enqueueSnackbar(`Vendor COI ${title} was created`);
    },
    onError: (): void => {
      enqueueSnackbar('New Vendor COI creation failed', { variant: 'error' });
    },
  });

  const { mutate: updateCOI, isLoading: updating } = useMutation(async (data: ISingleVendorCIO) => axios({
    url: `api/workspace-vendor-coi/${decrypt(cioId)}/`,
    method: 'patch',
    data,
  }), {
    onSuccess: (): void => {
      navigate('/workspace/settings/vendorCOI');
      enqueueSnackbar(`Vendor COI ${title} was saved`);
    },
    onError: (): void => {
      enqueueSnackbar('Vendor COI update failed', { variant: 'error' });
    },
  });

  const {
    control, formState, handleSubmit, setValue,
  } = useForm<IFormValues>({
    mode: 'onChange',
    defaultValues: cioDefaultValues,
    resolver: yupResolver(cioSchema),
  });
  const { errors } = formState;

  const onSubmit = (data: ISingleVendorCIO): void => {
    const payload = { ...data };
    if (!allProperties && selectedProperties.length === 0) {
      enqueueSnackbar('Atleast 1 property is required.');
      return;
    }
    setTitle(payload.name);
    payload.building_access_all = allProperties;
    payload.buildings = selectedProperties;
    console.log({ payload });
    if (cioId === 'new') {
      payload.property = currentBuilding.id;
      createNewCOI(payload);
      return;
    }
    updateCOI(payload);
  };

  const { fields, append } = useFieldArray({
    control,
    name: 'category_holders',
  });

  function StartDollerSign(): JSX.Element {
    return <div className='start-doller-sign'>$</div>;
  }

  useEffect(() => {
    // if (singleVendorCoi !== undefined) {
    //   const allkeys = Object.keys(singleVendorCoi);
    //   allkeys.map((key: MyKey): string => {
    //     setValue(key, singleVendorCoi[key], { shouldDirty: true, shouldValidate: true });
    //     return key;
    //   });
    // }

    if (singleVendorCoi !== undefined && cioId !== 'new') {
      console.log({ singleVendorCoi });
      setValue('name', singleVendorCoi.name, { shouldDirty: true, shouldValidate: true });
      setValue('id', singleVendorCoi.id, { shouldDirty: true, shouldValidate: true });
      setValue('med_exp', singleVendorCoi.med_exp, { shouldDirty: true, shouldValidate: true });
      setValue('products_comp', singleVendorCoi.products_comp, { shouldDirty: true, shouldValidate: true });
      setValue('property', singleVendorCoi.property, { shouldDirty: true, shouldValidate: true });
      setValue('personal_adv_injury', singleVendorCoi.personal_adv_injury, { shouldDirty: true, shouldValidate: true });
      setValue('property_damage_per_accident', singleVendorCoi.property_damage_per_accident, { shouldDirty: true, shouldValidate: true });
      setValue('aggregate', singleVendorCoi.aggregate, { shouldDirty: true, shouldValidate: true });
      setValue('bodily_injury_per_accident', singleVendorCoi.bodily_injury_per_accident, { shouldDirty: true, shouldValidate: true });
      setValue('bodily_injury_per_person', singleVendorCoi.bodily_injury_per_person, { shouldDirty: true, shouldValidate: true });
      setValue('building_access_all', singleVendorCoi.building_access_all, { shouldDirty: true, shouldValidate: true });
      setValue('disease_ea_employee', singleVendorCoi.disease_ea_employee, { shouldDirty: true, shouldValidate: true });
      setValue('disease_policy_limit', singleVendorCoi.disease_policy_limit, { shouldDirty: true, shouldValidate: true });
      setValue('each_accident', singleVendorCoi.each_accident, { shouldDirty: true, shouldValidate: true });
      setValue('each_occurrence', singleVendorCoi.each_occurrence, { shouldDirty: true, shouldValidate: true });
      setValue('each_occurrence_umbrella', singleVendorCoi.each_occurrence_umbrella, { shouldDirty: true, shouldValidate: true });
      setValue('combined_single_limit', singleVendorCoi.combined_single_limit, { shouldDirty: true, shouldValidate: true });
      setValue('damage_to_rented_premises', singleVendorCoi.damage_to_rented_premises, { shouldDirty: true, shouldValidate: true });
      setValue('general_aggregate', singleVendorCoi.general_aggregate, { shouldDirty: true, shouldValidate: true });
      setValue('claims_made', singleVendorCoi.claims_made, { shouldDirty: true, shouldValidate: true });
      setValue('claims_made_umbrella', singleVendorCoi.claims_made_umbrella, { shouldDirty: true, shouldValidate: true });
      setValue('any_auto', singleVendorCoi.any_auto, { shouldDirty: true, shouldValidate: true });
      setValue('anyone_excluded', singleVendorCoi.anyone_excluded, { shouldDirty: true, shouldValidate: true });
      setValue('can_be_mentioned_in_description', singleVendorCoi.can_be_mentioned_in_description, { shouldDirty: true, shouldValidate: true });
      setValue('commercial_general_liability', singleVendorCoi.commercial_general_liability, { shouldDirty: true, shouldValidate: true });
      setValue('ded', singleVendorCoi.ded, { shouldDirty: true, shouldValidate: true });
      setValue('excess_liab', singleVendorCoi.excess_liab, { shouldDirty: true, shouldValidate: true });
      setValue('general_other', singleVendorCoi.general_other, { shouldDirty: true, shouldValidate: true });
      setValue('general_other_value', singleVendorCoi.general_other_value, { shouldDirty: true, shouldValidate: true });
      setValue('hired_autos_only', singleVendorCoi.hired_autos_only, { shouldDirty: true, shouldValidate: true });
      setValue('loc', singleVendorCoi.loc, { shouldDirty: true, shouldValidate: true });
      setValue('must_be_named_certificate_holder', singleVendorCoi.must_be_named_certificate_holder, { shouldDirty: true, shouldValidate: true });
      setValue('name', singleVendorCoi.name, { shouldDirty: true, shouldValidate: true });
      setValue('non_owned_autos_only', singleVendorCoi.non_owned_autos_only, { shouldDirty: true, shouldValidate: true });
      setValue('occur', singleVendorCoi.occur, { shouldDirty: true, shouldValidate: true });
      setValue('occur_umbrella', singleVendorCoi.occur_umbrella, { shouldDirty: true, shouldValidate: true });
      setValue('other', singleVendorCoi.other, { shouldDirty: true, shouldValidate: true });
      setValue('owned_autos_only', singleVendorCoi.owned_autos_only, { shouldDirty: true, shouldValidate: true });
      setValue('per_statute', singleVendorCoi.per_statute, { shouldDirty: true, shouldValidate: true });
      setValue('policy', singleVendorCoi.policy, { shouldDirty: true, shouldValidate: true });
      setValue('project', singleVendorCoi.project, { shouldDirty: true, shouldValidate: true });
      setValue('retention_value', singleVendorCoi.retention_value, { shouldDirty: true, shouldValidate: true });
      setValue('scheduled_autos', singleVendorCoi.scheduled_autos, { shouldDirty: true, shouldValidate: true });
      setValue('umbrella_liab', singleVendorCoi.umbrella_liab, { shouldDirty: true, shouldValidate: true });
      setValue('category_holders', singleVendorCoi.category_holders, { shouldDirty: true, shouldValidate: true });

      if (singleVendorCoi.building_access_all) {
        setAllProperties(true);
      } else {
        setAllProperties(false);
      }
      if (singleVendorCoi.buildings !== undefined) {
        setSelectedProperties(singleVendorCoi.buildings);
      }
    }
    if (cioId === 'new') {
      setValue('category_holders', [{
        id: '',
        _id: 0,
        name: '',
        category: 'certificate_holder',
      },
      {
        id: '',
        _id: 0,
        name: '',
        category: 'additional_insured',
      }], { shouldDirty: true });
    }
  }, [cioId, setValue, singleVendorCoi]);

  const getPropertyValues = (list: ICOIBuilding[]): ICOIBuilding[] => {
    const result = list.filter((o1) => selectedProperties.some((o2) => o1.id === o2.id));
    console.log(result);
    return result;
  };

  return (
    <Grid container justifyContent='center' className='cio-form-wrapper'>
      <StradaLoader open={isLoading || creating || updating} message='Action in progress' />
      <Grid item sm={12} md={6}>
        <Stack spacing={1} direction='row' className='stack-header'>
          <div
            className='back-div'
          >
            {' '}
            <ArrowBackIcon
              className='back-icon cursor-pointer'
              onClick={(): void => {
                window.history.back();
              }}
            />
          </div>
          <p className='cio-form-heading'>
            {cioId === 'new' ? 'Add Additional Vendor Category' : `Edit ${singleVendorCoi === undefined ? '' : singleVendorCoi.name}`}
          </p>
        </Stack>

        <form id='vendor-coi-form' onSubmit={handleSubmit(onSubmit)}>
          <HookTextField
            name='name'
            label='Name'
            control={control}
            errors={errors}
          />
          <p className='cio-section-heading'> Apply for properties </p>

          <div className='event-duration-section'>
            <FormControl>
              <RadioGroup
                aria-labelledby='demo-radio-buttons-group-label-099'
                defaultValue={allProperties}
                value={allProperties}
                onChange={(): void => {
                  setAllProperties(!allProperties);
                  setSelectedProperties([]);
                }}
                name='radio-buttons-group-09878'
              >
                <div className='fixed-durations'>
                  <FormControlLabel value control={<Radio />} label='All' />
                  <FormControlLabel value={false} control={<Radio />} label='Select' />
                </div>
              </RadioGroup>
            </FormControl>
          </div>
          {!allProperties && (
            <div className='mt-3 mb-3'>
              <Autocomplete
                multiple
                id='checkboxes-tags-demo'
                options={workspacePropertiesList}
                value={getPropertyValues(workspacePropertiesList)}
                disableCloseOnSelect
                onChange={(event, newValue): void => {
                  setSelectedProperties(newValue);
                }}
                getOptionLabel={(option: ICOIBuilding): string => option.address}
                // filterSelectedOptions
                // getOptionSelected={(option, value): string => option.value === value.value}
                renderOption={(props, option, { selected }): JSX.Element => (
                  <li {...props}>
                    <Checkbox
                      icon={icon}
                      checkedIcon={checkedIcon}
                      style={{ marginRight: 8 }}
                      checked={selected}
                      // checked={!!selectedProperties.find((v) => v.address === option.address)}
                    />
                    {option.address}
                  </li>
                )}
                style={{ width: 500 }}
                renderInput={(params): JSX.Element => (
                  <TextField {...params} label='Apply for properties' placeholder='Type to filter options...' />
                )}
              />
            </div>
          )}

          <p className='cio-section-heading'> Required Certificate Headers </p>
          {fields.map((val, index) => (
            <HookTextField
              name={`category_holders.${index}.name`}
              label={val.category === 'certificate_holder' ? 'Certificate Holder' : 'Additional Insured'}
              control={control}
              errors={errors}
            />
          ))}
          {/* {fields.map((val, index) => (
            <div>
              {' '}
              {`category_holders.${index}.name`}
              {' '}
              {index}
              {' '}
            </div>

          ))} */}

          <div className='cio-add-btns'>
            <h4
              onClick={(): void => {
                append({
                  name: '',
                  category: 'certificate_holder',
                });
              }}
              aria-hidden='true'
            >
              {' '}
              + Add Another Required Certificate Holder
              {' '}

            </h4>
            <h4
              onClick={(): void => {
                append({
                  name: '',
                  category: 'additional_insured',
                });
              }}
              aria-hidden='true'
            >
              {' '}
              + Add Additional Insured
              {' '}

            </h4>
          </div>

          <div className='cio-info-box'>
            <p className='cio-section-heading'> Minimum Limits </p>
            <h6> Select as many or as little necessary requirements below </h6>
          </div>
          <div className='cio-info-box'>
            <p className='cio-section-heading'> Commercial General Liability </p>
            <h6>  Select the required boxes and relevant information </h6>
          </div>

          <HookTextField
            name='each_occurrence'
            label='Each Occurrence'
            control={control}
            errors={errors}
            type='number'
            startAdornment={<StartDollerSign />}
          />
          <HookTextField
            name='damage_to_rented_premises'
            label='Damage To Rented Premises'
            control={control}
            errors={errors}
            type='number'
            startAdornment={<StartDollerSign />}
          />
          <HookTextField
            name='med_exp'
            label='Med Exp'
            control={control}
            errors={errors}
            type='number'
            startAdornment={<StartDollerSign />}
          />
          <HookTextField
            name='personal_adv_injury'
            label='Personal & Advance Injury'
            control={control}
            errors={errors}
            type='number'
            startAdornment={<StartDollerSign />}
          />
          <HookTextField
            name='general_aggregate'
            label='General Aggregate'
            control={control}
            errors={errors}
            type='number'
            startAdornment={<StartDollerSign />}
          />
          <HookTextField
            name='products_comp'
            label='Products - Comp/OP AGG'
            control={control}
            errors={errors}
            type='number'
            startAdornment={<StartDollerSign />}
          />
          <div className='cio-checkbox-wrapper'>
            <HookCheckbox
              name='claims_made'
              label='Claims-Made'
              control={control}
            />
            <HookCheckbox
              name='occur'
              label='Occur'
              control={control}
            />
          </div>

          <div className='cio-info-box'>
            <p className='cio-section-heading'> Automobile Liability </p>
            <h6> Select the required boxes and relevant information </h6>
          </div>

          <Grid container spacing={2}>
            <Grid item sm={12} md={6}>
              <HookTextField
                name='combined_single_limit'
                label='Combined Single Limit'
                control={control}
                errors={errors}
                type='number'
                startAdornment={<StartDollerSign />}
              />
            </Grid>
            <Grid item sm={12} md={6}>
              <HookTextField
                name='bodily_injury_per_person'
                label='Bodily Injury (per person)'
                control={control}
                errors={errors}
                type='number'
                startAdornment={<StartDollerSign />}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item sm={12} md={6}>
              <HookTextField
                name='bodily_injury_per_accident'
                label='Bodily Injury (per accident)'
                control={control}
                errors={errors}
                type='number'
                startAdornment={<StartDollerSign />}
              />
            </Grid>
            <Grid item sm={12} md={6}>
              <HookTextField
                name='property_damage_per_accident'
                label='Property Damage (per accident)'
                control={control}
                errors={errors}
                type='number'
                startAdornment={<StartDollerSign />}
              />
            </Grid>
          </Grid>

          <div className='cio-checkbox-wrapper'>
            <HookCheckbox
              name='any_auto'
              label='Any Auto'
              control={control}
            />
            <HookCheckbox
              name='hired_autos_only'
              label='Hired Autos'
              control={control}
            />
            <HookCheckbox
              name='owned_autos_only'
              label='Owned Autos Only'
              control={control}
            />
            <HookCheckbox
              name='scheduled_autos'
              label='Scheduled Autos'
              control={control}
            />
            <HookCheckbox
              name='non_owned_autos_only'
              label='Non-Owned Autos Only'
              control={control}
            />
          </div>

          <div className='cio-info-box'>
            <p className='cio-section-heading'> Umbrella Liability </p>
            <h6> Select the required boxes and relevant information </h6>
          </div>

          <Grid container spacing={2}>
            <Grid item sm={12} md={6}>
              <HookTextField
                name='each_occurrence_umbrella'
                label='Each Occurrence Umbrella'
                control={control}
                errors={errors}
                type='number'
                startAdornment={<StartDollerSign />}
              />
            </Grid>
            <Grid item sm={12} md={6}>
              <HookTextField
                name='aggregate'
                label='Aggregate'
                control={control}
                errors={errors}
                type='number'
                startAdornment={<StartDollerSign />}
              />
            </Grid>
          </Grid>

          <div className='cio-checkbox-wrapper'>
            <HookCheckbox
              name='claims_made_umbrella'
              label='Claims-Made'
              control={control}
            />
            <HookCheckbox
              name='occur_umbrella'
              label='Occur'
              control={control}
            />
          </div>

          <div className='cio-info-box'>
            <p className='cio-section-heading'>Workers Compensation</p>
            <h6> Select the required boxes and relevant information </h6>
          </div>

          <HookTextField
            name='each_accident'
            label='E.L Each Accident'
            control={control}
            errors={errors}
            type='number'
            startAdornment={<StartDollerSign />}
          />
          <HookTextField
            name='disease_ea_employee'
            label='E.L. Disease - EA Employee'
            control={control}
            errors={errors}
            type='number'
            startAdornment={<StartDollerSign />}
          />
          <HookTextField
            name='disease_policy_limit'
            label='E. L. Disease - Policy Limit'
            control={control}
            errors={errors}
            type='number'
            startAdornment={<StartDollerSign />}
          />

          <div className='cio-checkbox-wrapper'>
            <HookCheckbox
              name='per_statute'
              label='Per Statue'
              control={control}
            />
            <HookCheckbox
              name='other'
              label='Other'
              control={control}
            />
          </div>

        </form>

        <div className='cio-footer'>
          <div className='action-btn'>
            <Button
              variant='outlined'
              onClick={(): void => { window.history.back(); }}
              style={{
                textTransform: 'inherit', color: '#00CFA1', border: '0', marginRight: '15px',
              }}
              color='primary'
            >
              Cancel
            </Button>
            <PrimayButton type='submit' form='vendor-coi-form'> Save </PrimayButton>
          </div>
        </div>

      </Grid>

    </Grid>

  );
}
