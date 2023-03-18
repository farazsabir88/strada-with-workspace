/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable react-hooks/exhaustive-deps */
// eslint-disable-next-line react-hooks/exhaustive-deps
import * as React from 'react';
import {
  Grid, Typography, Divider, Checkbox,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import {
  useQuery, useQueryClient, useMutation,
} from 'react-query';
import { useSelector } from 'react-redux';
import type { AxiosResponse } from 'axios';
import axios from 'axios';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import HookTextField from 'shared-components/hooks/HookTextField';
import HookSelectField from 'shared-components/hooks/HookSelectField';
import HookCheckbox from 'shared-components/hooks/HookCheckbox';
import type { IFormValues } from 'formsTypes';
import type { RootState } from 'mainStore';
import type { IeditCOIs } from 'admin/AdminFormTypes';
import { useNavigate } from 'react-router-dom';
import StradaLoader from 'shared-components/components/StradaLoader';
import type { BuildingsResponse } from 'admin/buildingSection/building-dashboard/types';
import type { IvendorFilterEdit, IvendorResponse } from '../types';
import type { ICoiPayload } from './types';

const defaultInput = {
  building: '',
  aggregate: 0,
  any_auto: true,
  anyone_excluded: true,
  authorized_representative: true,
  automobile_liability_addin: null,
  automobile_liability_eff_date: null,
  automobile_liability_exp_date: null,
  automobile_liability_insured: true,
  automobile_liability_policy_num: '',
  automobile_liability_subrogation: true,
  bodily_injury_per_accident: 0,
  bodily_injury_per_person: 0,
  certificate_holder: '',
  claims_made: true,
  claims_made_umbrella: true,
  cois_extra: null,
  combined_single_limit: 0,
  commercial_general_liability: true,
  created_at: '',
  damage_to_rented_premises: 0,
  ded: true,
  description_of_operations: '',
  disease_ea_employee: 0,
  disease_policy_limit: 0,
  each_accident: 0,
  each_occurrence: 0,
  each_occurrence_umbrella: 0,
  excess_liab: true,
  file: '',
  general_aggregate: 0,
  general_liability_addin: null,
  general_liability_eff_date: null,
  general_liability_exp_date: null,
  general_liability_insured: true,
  general_liability_policy_num: '',
  general_liability_subrogation: true,
  general_other: true,
  general_other_value: null,
  gl_accounts: null,
  hired_autos_only: true,
  id: 0,
  image: '',
  insured: '',
  loc: true,
  med_exp: 0,
  non_owned_autos_only: true,
  occur: true,
  occur_umbrella: true,
  other: true,
  owned_autos_only: true,
  per_statute: true,
  personal_adv_injury: 0,
  policy: true,
  products_comp: 0,
  project: true,
  property_damage_per_accident: 0,
  remove_insured_address: null,
  retention_value: null,
  scheduled_autos: true,
  sent_notes: true,
  status: '',
  subrogation_waiver: true,
  umbrella_liab: true,
  umbrella_liability_addin: null,
  umbrella_liability_eff_date: null,
  umbrella_liability_exp_date: null,
  umbrella_liability_insured: true,
  umbrella_liability_policy_num: '',
  umbrella_liability_subrogation: true,
  updated_at: '',
  user: 0,
  vendor_category: null,
  workers_liability_addin: null,
  workers_liability_eff_date: null,
  workers_liability_exp_date: null,
  workers_liability_insured: true,
  workers_liability_policy_num: '',
  workers_liability_subrogation: true,
};

interface Iprops {
  editData: IeditCOIs | undefined;
  handleClose: () => void;
}
export default function AddTemplate(props: Iprops): JSX.Element {
  const currentWorkspace = useSelector((state: RootState) => state.workspaces.currentWorkspace.currentWorkspace);
  const navigate = useNavigate();
  const { editData, handleClose } = props;
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const scrollRef = React.useRef<HTMLDivElement | null>(null);
  const [moreGeneralFields, setmoreGeneralFields] = React.useState<boolean>(false);
  const [moreAutomobileFields, setmoreAutomobileFields] = React.useState<boolean>(false);
  const [moreUmbrellaFields, setmoreUmbrellaFields] = React.useState<boolean>(false);
  const [moreWorkersFields, setmoreWorkersFields] = React.useState<boolean>(false);
  const [selected, setSelected] = React.useState(0);
  const [filteredVendorsList, setFilteredVendorsList] = React.useState<IvendorFilterEdit[]>([]);

  const [checkBoxData, setCheckBoxData] = React.useState([{
    id: 0,
    name: 'all',
    checked: false,
  }, {
    id: 1,
    name: 'general',
    checked: false,
  }, {
    id: 2,
    name: 'automobile',
    checked: false,
  }, {
    id: 3,
    name: 'umbrella',
    checked: false,
  }, {
    id: 4,
    name: 'workers',
    checked: false,
  }]);

  const {
    control, formState, handleSubmit, setValue, watch, getValues,
  } = useForm<IFormValues>({
    mode: 'onChange',
    defaultValues: defaultInput,
  });

  React.useEffect(() => {
    if (editData !== undefined) {
      setValue('property', Number(editData.property !== null ? editData.property.id : -1), { shouldDirty: true });
      setValue('aggregate', editData.aggregate, { shouldDirty: true });
      setValue('any_auto', editData.any_auto, { shouldDirty: true });
      setValue('anyone_excluded', editData.anyone_excluded, { shouldDirty: true });
      setValue('authorized_representative', editData.authorized_representative, { shouldDirty: true });
      setValue('automobile_liability_addin', editData.automobile_liability_addin, { shouldDirty: true });
      setValue('automobile_liability_eff_date', editData.automobile_liability_eff_date, { shouldDirty: true });
      setValue('automobile_liability_exp_date', editData.automobile_liability_exp_date, { shouldDirty: true });
      setValue('automobile_liability_insured', editData.automobile_liability_insured, { shouldDirty: true });
      setValue('automobile_liability_policy_num', editData.automobile_liability_policy_num, { shouldDirty: true });
      setValue('automobile_liability_subrogation', editData.automobile_liability_subrogation, { shouldDirty: true });
      setValue('bodily_injury_per_accident', editData.bodily_injury_per_accident, { shouldDirty: true });
      setValue('bodily_injury_per_person', editData.bodily_injury_per_person, { shouldDirty: true });
      setValue('certificate_holder', editData.certificate_holder, { shouldDirty: true });
      setValue('claims_made', editData.claims_made, { shouldDirty: true });
      setValue('claims_made_umbrella', editData.claims_made_umbrella, { shouldDirty: true });
      setValue('cois_extra', editData.cois_extra, { shouldDirty: true });
      setValue('combined_single_limit', editData.combined_single_limit, { shouldDirty: true });
      setValue('commercial_general_liability', editData.commercial_general_liability, { shouldDirty: true });
      setValue('created_at', editData.created_at, { shouldDirty: true });
      setValue('damage_to_rented_premises', editData.damage_to_rented_premises, { shouldDirty: true });
      setValue('ded', editData.ded, { shouldDirty: true });
      setValue('description_of_operations', editData.description_of_operations, { shouldDirty: true });
      setValue('disease_ea_employee', editData.disease_ea_employee, { shouldDirty: true });
      setValue('disease_policy_limit', editData.disease_policy_limit, { shouldDirty: true });
      setValue('each_accident', editData.each_accident, { shouldDirty: true });
      setValue('each_occurrence', editData.each_occurrence, { shouldDirty: true });
      setValue('each_occurrence_umbrella', editData.each_occurrence_umbrella, { shouldDirty: true });
      setValue('excess_liab', editData.excess_liab, { shouldDirty: true });
      setValue('file', editData.file, { shouldDirty: true });
      setValue('general_aggregate', editData.general_aggregate, { shouldDirty: true });
      setValue('general_liability_addin', editData.general_liability_addin, { shouldDirty: true });
      setValue('general_liability_eff_date', editData.general_liability_eff_date, { shouldDirty: true });
      setValue('general_liability_exp_date', editData.general_liability_exp_date, { shouldDirty: true });
      setValue('general_liability_insured', editData.general_liability_insured, { shouldDirty: true });
      setValue('general_liability_policy_num', editData.general_liability_policy_num, { shouldDirty: true });
      setValue('general_liability_subrogation', editData.general_liability_subrogation, { shouldDirty: true });
      setValue('general_other', editData.general_other, { shouldDirty: true });
      setValue('general_other_value', editData.general_other_value, { shouldDirty: true });
      setValue('gl_accounts', editData.gl_accounts, { shouldDirty: true });
      setValue('id', editData.id, { shouldDirty: true });
      setValue('image', editData.image, { shouldDirty: true });
      setValue('insured', editData.insured, { shouldDirty: true });
      setValue('loc', editData.loc, { shouldDirty: true });
      setValue('med_exp', editData.med_exp, { shouldDirty: true });
      setValue('non_owned_autos_only', editData.non_owned_autos_only, { shouldDirty: true });
      setValue('occur', editData.occur, { shouldDirty: true });
      setValue('occur_umbrella', editData.occur_umbrella, { shouldDirty: true });
      setValue('other', editData.other, { shouldDirty: true });
      setValue('owned_autos_only', editData.owned_autos_only, { shouldDirty: true });
      setValue('per_statute', editData.per_statute, { shouldDirty: true });
      setValue('personal_adv_injury', editData.personal_adv_injury, { shouldDirty: true });
      setValue('policy', editData.policy, { shouldDirty: true });
      setValue('products_comp', editData.products_comp, { shouldDirty: true });
      setValue('project', editData.project, { shouldDirty: true });
      setValue('property_damage_per_accident', editData.property_damage_per_accident, { shouldDirty: true });
      setValue('remove_insured_address', editData.remove_insured_address, { shouldDirty: true });
      setValue('retention_value', editData.retention_value, { shouldDirty: true });
      setValue('scheduled_autos', editData.scheduled_autos, { shouldDirty: true });
      setValue('sent_notes', editData.sent_notes, { shouldDirty: true });
      setValue('status', editData.status, { shouldDirty: true });
      setValue('subrogation_waiver', editData.subrogation_waiver, { shouldDirty: true });
      setValue('umbrella_liab', editData.umbrella_liab, { shouldDirty: true });
      setValue('umbrella_liability_addin', editData.umbrella_liability_addin, { shouldDirty: true });
      setValue('umbrella_liability_eff_date', editData.umbrella_liability_eff_date, { shouldDirty: true });
      setValue('umbrella_liability_exp_date', editData.umbrella_liability_exp_date, { shouldDirty: true });
      setValue('umbrella_liability_insured', editData.umbrella_liability_insured, { shouldDirty: true });
      setValue('umbrella_liability_policy_num', editData.umbrella_liability_policy_num, { shouldDirty: true });
      setValue('umbrella_liability_subrogation', editData.umbrella_liability_subrogation, { shouldDirty: true });
      setValue('updated_at', editData.updated_at, { shouldDirty: true });
      setValue('user', editData.user, { shouldDirty: true });
      setValue('vendor_category', editData.vendor_category, { shouldDirty: true });
      setValue('workers_liability_addin', editData.workers_liability_addin, { shouldDirty: true });
      setValue('workers_liability_eff_date', editData.workers_liability_eff_date, { shouldDirty: true });
      setValue('workers_liability_exp_date', editData.workers_liability_exp_date, { shouldDirty: true });
      setValue('workers_liability_policy_num', editData.workers_liability_policy_num, { shouldDirty: true });
      setValue('workers_liability_subrogation', editData.workers_liability_subrogation, { shouldDirty: true });
    }
  }, [editData]);

  const { errors } = formState;

  function StartDollerSign(): JSX.Element {
    return <div className='start-doller-sign'>$</div>;
  }
  const { data: getVendorsList = [] } = useQuery(
    'get/vendor',
    async () => axios({
      url: `api/filter/vendor-coi/?workspace=${currentWorkspace.id}`,
      method: 'get',
    }),
    {
      enabled: currentWorkspace.id !== 0,
      select: (res: AxiosResponse<IvendorResponse>) => res.data.detail.map((vendor) => ({
        name: vendor.name,
        value: vendor.id,
        buildings: vendor.buildings,
      })),
    },
  );
  React.useEffect(() => {
    if (scrollRef.current !== null) {
      scrollRef.current.scrollIntoView();
    }
  }, [scrollRef.current, moreWorkersFields]);
  const handleChangeRadioButton: (event: React.ChangeEvent<HTMLInputElement>) => void = (event) => {
    setValue('anyone_excluded', event.target.checked, { shouldDirty: true });
  };
  const { mutate, isLoading } = useMutation(async (data: ICoiPayload) => axios({
    url: `/api/coi/${editData?.id}/`,
    method: 'patch',
    data,
  }), {
    onSuccess: async () => {
      await queryClient.invalidateQueries('manager-approval').catch()
        .then();
      await queryClient.invalidateQueries('get/cois').catch()
        .then();
      await queryClient.invalidateQueries('get/vendor').catch()
        .then();
      await queryClient.invalidateQueries('get/cois-errors').catch()
        .then();
      navigate('/workspace/cois');

      handleClose();
      enqueueSnackbar('COI Saved Succsessfully!');
    },
    onError: () => {
      enqueueSnackbar('Failed!', { variant: 'error' });
    },
  });

  const onSubmit: SubmitHandler<IFormValues> = (paylaodData: IFormValues) => {
    const combined = [];
    const generalLiability = {
      Type: 'General Liability',
      Insurd: paylaodData.insured,
      startingDate: paylaodData.general_liability_eff_date,
      endDate: paylaodData.general_liability_exp_date,
      policyNum: paylaodData.automobile_liability_policy_num,
      Amount: paylaodData.each_occurrence,
      Addin: paylaodData.general_liability_addin,
      subrogation: paylaodData.automobile_liability_subrogation,
      selected: false,
      org: true,
      additional: paylaodData.general_liability_insured,
      subrogationCheck: paylaodData.workers_liability_subrogation,
      commercialGeneral: paylaodData.commercial_general_liability,
      claimsMade: paylaodData.claims_made,
      occur: paylaodData.occur,
      subrogationWaiver: paylaodData.subrogation_waiver,
      policy: paylaodData.policy,
      project: paylaodData.project,
      loc: paylaodData.loc,
      damageRented: paylaodData.damage_to_rented_premises,
      medExp: paylaodData.med_exp,
      personalInjury: paylaodData.personal_adv_injury,
      generalAgg: paylaodData.general_aggregate,
      products: paylaodData.products_comp,
    };
    const automobileLiability = {
      Type: 'Automobile Liability',
      Insurd: paylaodData.insured,
      startingDate: paylaodData.automobile_liability_eff_date,
      endDate: paylaodData.automobile_liability_exp_date,
      policyNum: paylaodData.automobile_liability_policy_num,
      Amount: paylaodData.combined_single_limit,
      Addin: paylaodData.automobile_liability_addin,
      subrogation: paylaodData.automobile_liability_subrogation,
      selected: false,
      org: true,
      additional: paylaodData.automobile_liability_insured,
      subrogationCheck: paylaodData.automobile_liability_subrogation,
      anyAuto: paylaodData.any_auto,
      ownedAutos: paylaodData.owned_autos_only,
      hiredAutos: paylaodData.hired_autos_only,
      scheduledAutos: paylaodData.scheduled_autos,
      nonOwnedAutos: paylaodData.non_owned_autos_only,
      injuryPerPerson: paylaodData.bodily_injury_per_person,
      injuryPerAccident: paylaodData.bodily_injury_per_accident,
      propertyDamage: paylaodData.property_damage_per_accident,
    };
    const umbrellaLiability = {
      Type: 'Umbrella Liability',
      Insurd: paylaodData.insured,
      startingDate: paylaodData.umbrella_liability_eff_date,
      endDate: paylaodData.umbrella_liability_exp_date,
      policyNum: paylaodData.umbrella_liability_policy_num,
      Amount: paylaodData.each_occurrence_umbrella,
      Addin: paylaodData.umbrella_liability_addin,
      subrogation: paylaodData.umbrella_liability_subrogation,
      selected: false,
      org: true,
      additional: paylaodData.umbrella_liability_insured,
      subrogationCheck: paylaodData.umbrella_liability_subrogation,
      excessLiab: paylaodData.excess_liab,
      occurUmbrella: paylaodData.occur_umbrella,
      claimsMadeUmbrella: paylaodData.claims_made_umbrella,
      umbrellaLiab: paylaodData.umbrella_liab,
      ded: paylaodData.ded,
      aggregate: paylaodData.aggregate,
      retention: paylaodData.retention_value,
    };

    const workersCompensations = {
      Type: 'Workers Compensation',
      Insurd: paylaodData.insured,
      startingDate: paylaodData.workers_liability_eff_date,
      endDate: paylaodData.workers_liability_exp_date,
      policyNum: paylaodData.workers_liability_policy_num,
      Amount: paylaodData.each_accident,
      Addin: paylaodData.workers_liability_addin,
      subrogation: paylaodData.workers_liability_subrogation,
      selected: false,
      org: true,
      additional: paylaodData.workers_liability_insured,
      subrogationCheck: paylaodData.workers_liability_subrogation,
      statutory: paylaodData.per_statute,
      other: paylaodData.other,
      diseaseEmployee: paylaodData.disease_ea_employee,
      diseasePolicy: paylaodData.disease_policy_limit,
      anyExclude: paylaodData.anyone_excluded ? 'true' : 'false',
    };
    combined.push(generalLiability);
    combined.push(automobileLiability);
    combined.push(umbrellaLiability);
    combined.push(workersCompensations);

    mutate({ ...paylaodData, combined });
  };

  React.useEffect(() => {
    let count = 0;
    checkBoxData.map((data) => {
      if (data.id !== 0) {
        if (data.checked) {
          count += 1;
        }
      }
      return data;
    });
    setSelected(count);
  }, [checkBoxData]);

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setCheckBoxData(checkBoxData.map((data) => {
      data.checked = event.target.checked;
      return data;
    }));
  };

  const handleSingleSelect = (event: React.ChangeEvent<HTMLInputElement>, id: number): void => {
    const newState = checkBoxData.map((data) => {
      if (data.id === id) {
        return { ...data, checked: event.target.checked };
      }

      return data;
    });

    setCheckBoxData(newState);
  };

  const { data: users = [] } = useQuery(
    ['get/buildings'],
    async () => axios({
      url: `api/filter/property/?workspace=${currentWorkspace.id}`,
      method: 'get',
    }),
    {
      select: (res: AxiosResponse<BuildingsResponse>) => {
        const options = res.data.detail.map((user: { address: string; id: number }) => ({
          name: user.address,
          value: user.id,
        }));

        return options;
      },
    },
  );
  const filteredVendors = (id: number | string): IvendorFilterEdit[] => {
    if (id === -1) return [];
    // eslint-disable-next-line array-callback-return
    const filter = getVendorsList.filter((item) => {
      if (item.buildings.length === 0 || item.buildings.includes(Number(id))) {
        return item;
      }
    });
    setFilteredVendorsList(filter);
    return filter;
  };
  React.useEffect(() => {
    const property = getValues('property');
    if (property !== undefined) { filteredVendors(property); }
  }, [watch('vendor_category'), watch('property')]);

  React.useEffect(() => {
    if (editData !== undefined) { filteredVendors(Number(editData.property !== null ? editData.property.id : -1)); }
  }, [editData]);

  /* eslint-disable @typescript-eslint/no-misused-promises */
  return (
    <div className='coi-edit-wrapper'>
      <StradaLoader open={isLoading} message='Saving' />
      <p className='edit-header'>
        Information
      </p>
      <form onSubmit={handleSubmit(onSubmit)} id='coi-edit-form'>

        <Grid container>
          <Grid container columnSpacing={2}>
            <Grid item sm={12} md={6}>
              <HookSelectField
                name='property'
                label='Property'
                options={users}
                control={control}
                errors={errors}
              />

            </Grid>

            <Grid item sm={12} md={6}>
              <HookTextField
                name='insured'
                label='Insured'
                control={control}
                errors={errors}
              />
            </Grid>
          </Grid>
          <Grid container columnSpacing={2} mt={1}>
            <Grid item sm={12} md={6}>
              <HookTextField
                name='certificate_holder'
                label='Certificate Holder'
                control={control}
                errors={errors}
              />
            </Grid>

            <Grid item sm={12} md={6}>
              <HookSelectField
                name='vendor_category'
                label='Vendor Category'
                options={filteredVendorsList.length === 0 ? getVendorsList : filteredVendorsList}
                control={control}
                errors={errors}
              />
            </Grid>
          </Grid>
          <Grid item sm={12} md={12} mt={1}>
            <HookTextField
              name='description_of_operations'
              label='Notes'
              control={control}
              errors={errors}
            />
          </Grid>
          <p className='sub-header'>
            Coverage Components
          </p>
          <div className='scroll-form'>
            <div className='checkbox-header'>
              <Checkbox
                name={checkBoxData[0].name}
                checked={checkBoxData[0].checked || selected >= 1}
                onChange={handleSelectAll}
                className='me-4'
              />
              {selected > 0 ? (
                <p>
                  {' '}
                  {selected}
                  {' '}
                  Selected
                </p>
              ) : (
                <p>
                  {' '}
                  {selected}
                  {' '}
                  Select All
                </p>
              )}
            </div>

            <Divider className='divider' />
            <div style={checkBoxData[1].checked ? { backgroundColor: '#7ef5dbb0' } : {}}>
              <div className='checkbox-header'>
                <Checkbox
                  name={checkBoxData[1].name}
                  checked={checkBoxData[1].checked}
                  onChange={(e): void => { handleSingleSelect(e, 1); }}
                  className='me-4'
                />
                <p> General Liability </p>
              </div>
              <Grid container className='general-container'>
                <Grid container columnSpacing={2}>
                  <Grid item sm={12} md={6}>
                    <HookTextField
                      name='each_occurrence'
                      label='Each Occurrence*'
                      type='number'
                      control={control}
                      errors={errors}
                      startAdornment={<StartDollerSign />}
                    />
                  </Grid>
                  <Grid item sm={12} md={6}>
                    <HookTextField
                      name='general_liability_policy_num'
                      label='Policy Num'
                      control={control}
                      errors={errors}
                    />
                  </Grid>
                </Grid>
                <Grid container columnSpacing={2}>
                  <Grid item sm={6} md={3}>
                    <HookTextField
                      name='general_liability_eff_date'
                      label='Start Date'
                      control={control}
                      errors={errors}
                      type='date'
                    />
                  </Grid>
                  <Grid item sm={6} md={3}>
                    <HookTextField
                      name='general_liability_exp_date'
                      label='End Date'
                      control={control}
                      errors={errors}
                      type='date'
                    />
                  </Grid>

                </Grid>
                <Grid item md={12} className='aditional-insured' mt={-1.4} ml={-1}>
                  <HookCheckbox
                    name='general_liability_insured'
                    label=''
                    control={control}
                  />
                  <p> Additional Insured </p>
                </Grid>

                <Grid item md={12} className='aditional-insured' mt={-2} ml={-1}>
                  <HookCheckbox
                    name='general_liability_subrogation'
                    label=''
                    control={control}
                  />
                  <p> Subrogation waived </p>
                </Grid>
                <Typography className='toggle-button' onClick={(): void => { setmoreGeneralFields(!moreGeneralFields); }}>  More fields</Typography>
                { moreGeneralFields
           && (
             <>
               <Grid container columnSpacing={2}>
                 <Grid item sm={12} md={4}>
                   <HookTextField
                     name='damage_to_rented_premises'
                     label='Damage to Rented'
                     type='number'
                     control={control}
                     errors={errors}
                   />
                 </Grid>
                 <Grid item sm={12} md={5}>
                   <HookTextField
                     name='med_exp'
                     label='Med Exp'
                     type='number'
                     control={control}
                     errors={errors}
                   />
                 </Grid>
                 <Grid item sm={12} md={3}>
                   <HookTextField
                     name='personal_adv_injury'
                     label='Personal Injury'
                     type='number'
                     control={control}
                     errors={errors}
                   />
                 </Grid>
               </Grid>

               <Grid container columnSpacing={3}>
                 <Grid item sm={12} md={6}>
                   <HookTextField
                     name='general_aggregate'
                     label='General Aggregate'
                     type='number'
                     control={control}
                     errors={errors}
                   />
                 </Grid>
                 <Grid item sm={12} md={6}>
                   <HookTextField
                     name='products_comp'
                     label='Products'
                     type='number'
                     control={control}
                     errors={errors}
                   />
                 </Grid>
               </Grid>
               <Grid container columnSpacing={3}>
                 <Grid item md={6} className='aditional-insured' mt={-3.4} ml={-1}>
                   <HookCheckbox
                     name='commercial_general_liability'
                     label=''
                     control={control}
                   />
                   <p> Commercial General Liability </p>
                 </Grid>

                 <Grid item md={6} className='aditional-insured' mt={-2} ml={-2}>
                   <HookCheckbox
                     name='occur'
                     label=''
                     control={control}
                   />
                   <p> Occur  </p>
                 </Grid>
               </Grid>
               <Grid container columnSpacing={3}>
                 <Grid item md={6} className='aditional-insured' mt={-3.4} ml={-1}>
                   <HookCheckbox
                     name='claims_made'
                     label=''
                     control={control}
                   />
                   <p> Claims Made </p>
                 </Grid>

                 <Grid item md={6} className='aditional-insured' mt={-2} ml={-2}>
                   <HookCheckbox
                     name='subrogation_waiver'
                     label=''
                     control={control}
                   />
                   <p> Subrogation waiver </p>
                 </Grid>
               </Grid>
               <p className='inner-sub-header'>
                 Subrogation waiver
               </p>
               <Grid container columnSpacing={3}>
                 <Grid item md={12} className='aditional-insured' mt={-2.8} ml={-1}>
                   <HookCheckbox
                     name='policy'
                     label=''
                     control={control}
                   />
                   <p> Policy </p>
                 </Grid>

                 <Grid item md={12} className='aditional-insured' mt={-2} ml={-1}>
                   <HookCheckbox
                     name='project'
                     label=''
                     control={control}
                   />
                   <p> Project</p>
                 </Grid>
                 <Grid item md={12} className='aditional-insured' mt={-2} ml={-1} mb={2.5}>
                   <HookCheckbox
                     name='loc'
                     label=''
                     control={control}
                   />
                   <p> Loc</p>
                 </Grid>
               </Grid>
             </>
           )}
              </Grid>
            </div>
            <Divider className='divider' />
            <div style={checkBoxData[2].checked ? { backgroundColor: '#7ef5dbb0' } : {}}>
              <div className='checkbox-header'>
                <Checkbox
                  name={checkBoxData[2].name}
                  checked={checkBoxData[2].checked}
                  onChange={(e): void => { handleSingleSelect(e, 2); }}
                  className='me-4'
                />
                <p> Automobile Liability</p>
              </div>

              <Grid container className='general-container'>
                <Grid container columnSpacing={2}>
                  <Grid item sm={12} md={6}>
                    <HookTextField
                      name='combined_single_limit'
                      label='Combined Single Limit*'
                      type='number'
                      control={control}
                      errors={errors}
                      startAdornment={<StartDollerSign />}
                    />
                  </Grid>
                  <Grid item sm={12} md={6}>
                    <HookTextField
                      name='automobile_liability_policy_num'
                      label='Policy Num'
                      control={control}
                      errors={errors}
                    />
                  </Grid>
                </Grid>
                <Grid container columnSpacing={2}>
                  <Grid item sm={6} md={3}>
                    <HookTextField
                      name='automobile_liability_eff_date'
                      label='Start Date'
                      control={control}
                      errors={errors}
                      type='date'
                    />
                  </Grid>
                  <Grid item sm={6} md={3}>
                    <HookTextField
                      name='automobile_liability_exp_date'
                      label='End Date'
                      control={control}
                      errors={errors}
                      type='date'
                    />
                  </Grid>

                </Grid>
                <Grid item md={12} className='aditional-insured' mt={-1.4} ml={-1}>
                  <HookCheckbox
                    name='automobile_liability_insured'
                    label=''
                    control={control}
                  />
                  <p> Additional Insured </p>
                </Grid>

                <Grid item md={12} className='aditional-insured' mt={-2} ml={-1}>
                  <HookCheckbox
                    name='automobile_liability_subrogation'
                    label=''
                    control={control}
                  />
                  <p> Subrogation waived </p>
                </Grid>
                <Typography className='toggle-button' onClick={(): void => { setmoreAutomobileFields(!moreAutomobileFields); }}>  More fields</Typography>
                {moreAutomobileFields && (
                  <>
                    {' '}
                    <Grid container columnSpacing={2}>
                      <Grid item sm={12} md={4}>
                        <HookTextField
                          name='bodily_injury_per_person'
                          label='Bodily Injury Per Person'
                          type='number'
                          control={control}
                          errors={errors}
                        />
                      </Grid>
                      <Grid item sm={12} md={4}>
                        <HookTextField
                          name='bodily_injury_per_accident'
                          label='Bodily Injury Per Accident'
                          type='number'
                          control={control}
                          errors={errors}
                        />
                      </Grid>
                      <Grid item sm={12} md={4}>
                        <HookTextField
                          name='property_damage_per_accident'
                          label='Property Damage'
                          type='number'
                          control={control}
                          errors={errors}
                        />
                      </Grid>
                    </Grid>

                    <Grid container columnSpacing={3}>
                      <Grid item md={6} className='aditional-insured' mt={-3.4} ml={-1}>
                        <HookCheckbox
                          name='any_auto'
                          label=''
                          control={control}
                        />
                        <p> Any Auto  </p>
                      </Grid>

                      <Grid item md={6} className='aditional-insured' mt={-2} ml={-2}>
                        <HookCheckbox
                          name='scheduled_autos'
                          label=''
                          control={control}
                        />
                        <p> Scheduled Autos </p>
                      </Grid>
                    </Grid>
                    <Grid container columnSpacing={3}>
                      <Grid item md={6} className='aditional-insured' mt={-3.4} ml={-1}>
                        <HookCheckbox
                          name='owned_autos_only'
                          label=''
                          control={control}
                        />
                        <p> Owned Autos </p>
                      </Grid>

                      <Grid item md={6} className='aditional-insured' mt={-2} ml={-2}>
                        <HookCheckbox
                          name='non_owned_autos_only'
                          label=''
                          control={control}
                        />
                        <p> Non-owned Autos </p>
                      </Grid>

                      <Grid item md={6} className='aditional-insured' mt={-3.4} ml={-1} mb={2.4}>
                        <HookCheckbox
                          name='hired_autos_only'
                          label=''
                          control={control}
                        />
                        <p> Hired Auto  </p>
                      </Grid>

                    </Grid>
                  </>
                )}

              </Grid>
            </div>

            <Divider className='divider' />
            <div style={checkBoxData[3].checked ? { backgroundColor: '#7ef5dbb0' } : {}}>
              <div className='checkbox-header'>
                <Checkbox
                  name={checkBoxData[3].name}
                  checked={checkBoxData[3].checked}
                  onChange={(e): void => { handleSingleSelect(e, 3); }}
                  className='me-4'
                />
                <p> Umbrella Liability </p>
              </div>
              <Grid container className='general-container'>
                <Grid container columnSpacing={2}>
                  <Grid item sm={12} md={6}>
                    <HookTextField
                      name='each_occurrence_umbrella'
                      label='Each Occurrence*'
                      type='number'
                      control={control}
                      errors={errors}
                      startAdornment={<StartDollerSign />}
                    />
                  </Grid>
                  <Grid item sm={12} md={6}>
                    <HookTextField
                      name='umbrella_liability_policy_num'
                      label='Policy Num'
                      control={control}
                      errors={errors}
                    />
                  </Grid>
                </Grid>
                <Grid container columnSpacing={2}>
                  <Grid item sm={6} md={3}>
                    <HookTextField
                      name='umbrella_liability_eff_date'
                      label='Start Date'
                      control={control}
                      errors={errors}
                      type='date'
                    />
                  </Grid>
                  <Grid item sm={6} md={3}>
                    <HookTextField
                      name='umbrella_liability_exp_date'
                      label='End Date'
                      control={control}
                      errors={errors}
                      type='date'
                    />
                  </Grid>

                </Grid>
                <Grid item md={12} className='aditional-insured' mt={-1.4} ml={-1}>
                  <HookCheckbox
                    name='umbrella_liability_insured'
                    label=''
                    control={control}
                  />
                  <p> Additional Insured </p>
                </Grid>

                <Grid item md={12} className='aditional-insured' mt={-2} ml={-1}>
                  <HookCheckbox
                    name='umbrella_liability_subrogation'
                    label=''
                    control={control}
                  />
                  <p> Subrogation waived </p>
                </Grid>
                <Typography className='toggle-button' onClick={(): void => { setmoreUmbrellaFields(!moreUmbrellaFields); }}>  More fields</Typography>

                {moreUmbrellaFields
                && (
                  <>
                    <Grid container columnSpacing={3}>
                      <Grid item sm={12} md={6}>
                        <HookTextField
                          name='aggregate'
                          label='Aggregate'
                          type='number'
                          control={control}
                          errors={errors}
                          startAdornment={<StartDollerSign />}
                        />
                      </Grid>
                      <Grid item sm={12} md={6}>
                        <HookTextField
                          name='retention_value'
                          label='Retention'
                          type='number'
                          control={control}
                          errors={errors}
                        />
                      </Grid>
                    </Grid>
                    <Grid container columnSpacing={3}>
                      <Grid item md={6} className='aditional-insured' mt={-3.4} ml={-1}>
                        <HookCheckbox
                          name='excess_liab'
                          label=''
                          control={control}
                        />
                        <p> Excess Liab </p>
                      </Grid>

                      <Grid item md={6} className='aditional-insured' mt={-2} ml={-2}>
                        <HookCheckbox
                          name='umbrella_liab'
                          label=''
                          control={control}
                        />
                        <p>  Umbrella Liab </p>
                      </Grid>
                    </Grid>
                    <Grid container columnSpacing={3}>
                      <Grid item md={6} className='aditional-insured' mt={-3.4} ml={-1}>
                        <HookCheckbox
                          name='occur_umbrella'
                          label=''
                          control={control}
                        />
                        <p> Occur </p>
                      </Grid>

                      <Grid item md={6} className='aditional-insured' mt={-2} ml={-2}>
                        <HookCheckbox
                          name='ded'
                          label=''
                          control={control}
                        />
                        <p>  Ded </p>
                      </Grid>
                      <Grid item md={6} className='aditional-insured' mt={-3.4} ml={-1} mb={2.4}>
                        <HookCheckbox
                          name='claims_made_umbrella'
                          label=''
                          control={control}
                        />
                        <p> Claims Made </p>
                      </Grid>
                    </Grid>

                  </>
                )}
              </Grid>
            </div>
            <Divider className='divider' />
            <div style={checkBoxData[4].checked ? { backgroundColor: '#7ef5dbb0' } : {}}>
              <div className='checkbox-header'>
                <Checkbox
                  name={checkBoxData[4].name}
                  checked={checkBoxData[4].checked}
                  onChange={(e): void => { handleSingleSelect(e, 4); }}
                  className='me-4'
                />
                <p> Workers Compensation</p>
              </div>
              <Grid container className='general-container'>
                <Grid container columnSpacing={2}>
                  <Grid item sm={12} md={6}>
                    <HookTextField
                      name='each_accident'
                      label='E.L Each Accident*'
                      type='number'
                      control={control}
                      errors={errors}
                      startAdornment={<StartDollerSign />}
                    />
                  </Grid>
                  <Grid item sm={12} md={6}>
                    <HookTextField
                      name='workers_liability_policy_num'
                      label='Policy Num'
                      control={control}
                      errors={errors}
                    />
                  </Grid>
                </Grid>
                <Grid container columnSpacing={2}>
                  <Grid item sm={6} md={3}>
                    <HookTextField
                      name='workers_liability_eff_date'
                      label='Start Date'
                      control={control}
                      errors={errors}
                      type='date'
                    />
                  </Grid>
                  <Grid item sm={6} md={3}>
                    <HookTextField
                      name='workers_liability_exp_date'
                      label='End Date'
                      control={control}
                      errors={errors}
                      type='date'
                    />
                  </Grid>

                </Grid>
                <Grid item md={12} className='aditional-insured' mt={-1.4} ml={-1}>
                  <HookCheckbox
                    name='workers_liability_insured'
                    label=''
                    control={control}
                  />
                  <p> Additional Insured </p>
                </Grid>

                <Grid item md={12} className='aditional-insured' mt={-2} ml={-1}>
                  <HookCheckbox
                    name='workers_liability_subrogation'
                    label=''
                    control={control}
                  />
                  <p> Subrogation waived </p>
                </Grid>

                <Typography
                  className='toggle-button'
                  onClick={(): void => {
                    setmoreWorkersFields(!moreWorkersFields);
                  }}
                >
                  {' '}
                  More fields

                </Typography>

                { moreWorkersFields
           && (
             <>
               <Grid container columnSpacing={3} ref={scrollRef}>
                 <Grid item sm={12} md={6}>
                   <HookTextField
                     name='disease_ea_employee'
                     label='E.L Disease EA Employee'
                     type='number'
                     control={control}
                     errors={errors}
                     startAdornment={<StartDollerSign />}
                   />
                 </Grid>
                 <Grid item sm={12} md={6}>
                   <HookTextField
                     name='disease_policy_limit'
                     label='E.L Disease Policy Limit'
                     type='number'
                     control={control}
                     errors={errors}
                   />
                 </Grid>
               </Grid>
               <Grid container columnSpacing={3}>
                 <Grid item md={12} className='aditional-insured' mt={-2.8} ml={-1}>
                   <HookCheckbox
                     name='per_statute'
                     label=''
                     control={control}
                   />
                   <p>WC Statutory Limits </p>
                 </Grid>

                 <Grid item md={12} className='aditional-insured' mt={-2} ml={-1}>
                   <HookCheckbox
                     name='other'
                     label=''
                     control={control}
                   />
                   <p> Other   </p>
                 </Grid>
                 <Grid item md={12} className='aditional-insured' mt={-2} mb={2}>
                   <FormControl>
                     <FormLabel id='demo-controlled-radio-buttons-group' className='radio-button-label'>Any Excluded?</FormLabel>
                     <RadioGroup
                       aria-labelledby='demo-controlled-radio-buttons-group'
                       name='controlled-radio-buttons-group'
                       value={watch('anyone_excluded')}
                       onChange={handleChangeRadioButton}
                     >
                       <FormControlLabel value control={<Radio />} label='Yes' />
                       <FormControlLabel value={false} control={<Radio />} label='No' />
                     </RadioGroup>
                   </FormControl>
                 </Grid>
               </Grid>
             </>

           ) }
              </Grid>
            </div>
          </div>
        </Grid>
      </form>

    </div>

  );
}
