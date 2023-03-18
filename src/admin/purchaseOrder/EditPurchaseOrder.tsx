/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import { Button, Grid } from '@mui/material';
import axios from 'axios';
import type { AxiosResponse } from 'axios';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import type { SubmitHandler } from 'react-hook-form';
import { useQuery, useMutation } from 'react-query';
import {
  useLocation,
} from 'react-router-dom';
import _ from 'lodash';
import type { IFormValues } from 'formsTypes';
import PrimayButton from 'shared-components/components/PrimayButton';
import StradaLoader from 'shared-components/components/StradaLoader';
import HookSelectField from 'shared-components/hooks/HookSelectField';
import HookTextField from 'shared-components/hooks/HookTextField';
import type { IPurchaseOrder, IDetails } from 'admin/AdminFormTypes';
import 'admin/purchaseOrder/_purchaseOrder.scss';
import HookCheckbox from 'shared-components/hooks/HookCheckbox';
import type {
  IGLData, IGLResponse, IVendorListing,
} from 'admin/purchaseOrder/types';
import { makeStyles } from '@mui/styles';
import { useSelector } from 'react-redux';
import type { RootState } from 'mainStore';
import CustomInputField from 'shared-components/inputs/CustomInputField';
import Sidebar from 'admin/sidebar';

const useStyles = makeStyles({
  select_why: {
    '& ul': {
      backgroundColor: '#cccccc',
    },
    '& li': {
      fontSize: 12,
    },
  },
});

interface IVendor {
  id: number;
  label: string;
  name: string;
  job: string | null;
}

interface IYardiData {
  property_id: string | null;
  id: number;
}

const detailFormDefaultValues: IPurchaseOrder = {
  vendor_info: '',
  vendor: null,
  expense_type: '',
  Payment_due: null,
  last_received: '',
  description: '',
  delivery_date: null,
  order_date: null,
  Required_by: null,
  closed: false,
  close_date: null,
  sub_total: 0,
  shipping: 0,
  taxes: 0,
  total: 0,
  details: [],
  event: null,
  manager_approval: null,
  property: NaN,
};

const detailSchema = {
  description: yup.string().required('Required').matches(/^\s*\S[^]*$/, 'This field cannot contain only blankspaces'),
  account: yup.string().required('Required'),
};

const schema = yup.object().shape({
  vendor: yup.string().required('Select Vendor'),
  details: yup.array().of(yup.object().shape(detailSchema)).required('Must have fields').min(1, 'Minimum of 1 field'),
});

function EditPurchaseOrder(): JSX.Element {
  const poData = useLocation().state as IVendorListing;
  const classes = useStyles();
  const currentBuilding = useSelector((state: RootState) => state.workspaces.currentBuilding);
  const currentWorkspace = useSelector((state: RootState) => state.workspaces.currentWorkspace.currentWorkspace);
  const [vendorList, setVendorList] = useState<IVendor[]>([]);
  const [vendor, setVendor] = useState<IVendor | null>(null);
  const [expenseList, setExpenseList] = useState([]);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const {
    control, formState, handleSubmit, watch, setValue, getValues,
  } = useForm<IFormValues>({
    mode: 'onChange',
    defaultValues: detailFormDefaultValues,
    resolver: yupResolver(schema),
  });
  const { append, remove, fields } = useFieldArray({
    name: 'details',
    control,
  });

  const watchTest = useWatch({
    control,
    name: 'details',
  });

  const watchShipping = watch('shipping');
  const watchTaxes = watch('taxes');

  const { isLoading } = useQuery(
    'get-vendors-by-workpsace-id',
    async () => axios({
      url: `api/filter/vendor/?workspace=${currentWorkspace.id}`,
      method: 'GET',
    }),
    {
      onSuccess: (res) => {
        if (res.data?.detail !== undefined && res.data.detail.length !== 0) {
          const data = res.data.detail;
          const list: IVendor[] = data.map((item: IVendor) => {
            const obj = {
              id: item.id,
              name: item.name || '',
              value: item.id,
              label: item.label || '',
            };
            return obj;
          });
          setVendorList(list);
        }
      },
    },
  );

  const getTotal = (): void => {
    const subtotal = getValues('sub_total');
    const total = Number(subtotal) + Number(watchShipping) + Number(watchTaxes);
    setValue('total', total);
  };
  const handleVendorValue = (value: IVendor | null): void => {
    if (value !== null) {
      setValue('vendor', Number(value.id), { shouldDirty: true });
      setVendor(value);
    }
  };

  useEffect(() => {
    getTotal();
  }, [watchShipping, watchTaxes]);

  const getSubTotalAmount = (): void => {
    const getDetails = watch('details');
    const subtotal = getDetails.reduce((acc, obj) => acc + Number(obj.amount), 0);
    setValue('sub_total', Number(subtotal));
    getTotal();
  };

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>): void => {
    setValue(e.target.name, e.target.value);

    const amount = Number(watchTest[index].quantity) * Number(watchTest[index].unit_price);
    setValue(`details.${index}.amount`, amount.toString());

    getSubTotalAmount();
  };

  const { errors } = formState;

  const { mutate: getExpenseList } = useMutation(async (data: IYardiData) => axios({
    url: 'api/yardi/get_expenses/',
    method: 'POST',
    data,
  }), {

  });

  useEffect(() => {
    if (currentBuilding.yardi_code !== '' && currentBuilding.yardi_connected) {
      const data = {
        property_id: currentBuilding.yardi_code,
        id: currentBuilding.id,
      };
      getExpenseList(data);
      setExpenseList([]);
    }
  }, [currentBuilding]);

  const { data: glCodes = [] } = useQuery(
    'get-gl-accounts',
    async () => axios({
      url: `api/filter/gl-code/?workspace=${currentWorkspace.id}`,
      method: 'GET',
    }),
    {
      select: (res: AxiosResponse<IGLResponse>) => res.data.detail.map((gl: IGLData) => ({
        name: `${gl.gl_code} ${gl.gl_account}`, value: gl.gl_code, label: gl.gl_account, id: gl.id,
      })),
    },
  );

  useEffect(() => {
    if (poData.vendor !== null) {
      const vendorDetail = {
        name: poData.vendor.name,
        id: poData.vendor.id,
        label: poData.vendor.label,
        job: poData.vendor.job,
      };

      setVendor(vendorDetail);
      setValue('vendor', Number(vendorDetail.id), { shouldDirty: true });
    }
    setValue('vendor_info', poData.vendor_info, { shouldDirty: true });
    setValue('expense_type', poData.expense_type.label, { shouldDirty: true });
    setValue('Payment_due', poData.Payment_due, { shouldDirty: true });
    setValue('last_received', poData.last_received, { shouldDirty: true });
    setValue('description', poData.description, { shouldDirty: true });
    setValue('delivery_date', poData.delivery_date, { shouldDirty: true });
    setValue('order_date', poData.order_date, { shouldDirty: true });
    setValue('closed', poData.closed, { shouldDirty: true });
    setValue('close_date', poData.close_date, { shouldDirty: true });
    setValue('shipping', Number(poData.shipping), { shouldDirty: true });
    setValue('taxes', Number(poData.taxes), { shouldDirty: true });
    setValue('total', Number(poData.total), { shouldDirty: true });
    if (poData.details.length > 0) {
      poData.details.forEach((item) => {
        append({
          description: item.description,
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          account: item.account !== undefined ? item.account.value : '',
          quantity: item.quantity,
          unit_price: item.unit_price,
          amount: item.amount,
        });
      });
    }
  }, [poData]);

  const { mutate: editPO } = useMutation(async (data: IPurchaseOrder) => axios({
    url: `api/purchase-orders/${poData.id}/`,
    method: 'patch',
    data,
  }), {
    onSuccess: () => {
      window.history.back();
    },
  });
  const getGLAccountValues = (details: IDetails[]): IDetails[] => details.map((detail) => {
    detail.account = glCodes.find((code) => {
      if (code.value === detail.account) {
        return { label: code.name, value: code.value };
      }
      return null;
    });
    return detail;
  });
  const onSubmit: SubmitHandler<IFormValues> = (data: IFormValues): void => {
    data.vendor = getValues('vendor');
    getGLAccountValues(data.details);
    data.event = Number(poData.event);
    data.property = poData.property.id;
    editPO(data);
  };

  const handleCancel = (): void => {
    window.history.back();
  };

  function StartDollerSign(): JSX.Element {
    return <div className='start-doller-sign'>$</div>;
  }

  const onDeleteDetail = (index: number): void => {
    remove(index);
    getSubTotalAmount();
  };

  const onAddNewClick = (): void => {
    const newData = {
      description: '',
      account: '',
      quantity: '1',
      unit_price: '',
      amount: '',
    };
    append(newData);
  };

  const scrollIntoView = (): void => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  useEffect(() => {
    scrollIntoView();
  }, []);

  const getStatusValue = (value: number | undefined): JSX.Element => {
    if (value === 0) {
      return <div className='f-badge not-approved'>Not Approved</div>;
    } if (value === 1) {
      return <div className='f-badge waiting'>Waiting for Approval</div>;
    } if (value === 2) {
      return <div className='f-badge approved'>Approved</div>;
    } if (value === 3) {
      return <div className='f-badge rejected'>Rejected</div>;
    }
    return <div />;
  };
  return (
    <div style={{ display: 'flex' }} ref={scrollRef}>
      <Sidebar variant='main' activeLink='purchase-order' />
      <div style={{ paddingTop: '82px' }}>
        <StradaLoader open={isLoading} />

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid
            container
            justifyContent='center'
            className='mt-4'
          >
            <Grid item sm={12} md={8}>

              <Grid container columnSpacing={2}>
                <Grid item sm={12}>
                  <div className='d-flex '>
                    <div className='mb-4 fw-normal fs-5 text-muted'>
                      <span onClick={handleCancel} className='cursor-pointer' aria-hidden='true'><i className='fas fa-arrow-left me-4' /></span>
                      {poData.event_name}
                    </div>
                    <div className='PO-status px-xl-4 pt-1'>
                      {getStatusValue(poData.status)}
                    </div>
                  </div>
                </Grid>

                <Grid item className='fw-normal fs-6 mb-3'>Vendor Information</Grid>

                <Grid item sm={12}>
                  <Autocomplete
                    disableClearable
                    options={vendorList}
                    value={vendor}
                    style={{ marginBottom: '20px' }}
                    onChange={(obj: React.SyntheticEvent, value): void => { handleVendorValue(value); }}
                    renderInput={(params): JSX.Element => (
                      <TextField
                        {...params}
                        placeholder='Search by name'
                        name='vendor'
                        label='Choose vendor*'
                      />
                    )}
                  />

                </Grid>
                <Grid item sm={12}>
                  <HookTextField
                    name='vendor_info'
                    label='Vendor Info'
                    rows={4}
                    multiline
                    control={control}
                    errors={errors}
                  />
                </Grid>

                <Grid item sm={12} md={4}>
                  <HookSelectField
                    name='expense_type'
                    label='Expense Type'
                    control={control}
                    errors={errors}
                    options={expenseList}
                  />
                </Grid>
                <Grid item sm={12} md={4}>
                  <HookTextField
                    name='Payment_due'
                    label='Payment Due'
                    control={control}
                    errors={errors}
                    type='date'
                  />
                </Grid>
                <Grid item sm={12} md={4}>
                  <HookTextField
                    name='last_received'
                    label='Last Received'
                    control={control}
                    errors={errors}
                  />
                </Grid>
                <Grid item sm={12}>
                  <HookTextField
                    name='description'
                    label='Description'
                    rows={4}
                    multiline
                    control={control}
                    errors={errors}
                  />
                </Grid>

                <Grid item sm={12} md={4}>
                  <HookTextField
                    name='delivery_date'
                    label='Delivery Date'
                    control={control}
                    errors={errors}
                    type='date'
                  />
                </Grid>
                <Grid item sm={12} md={4}>
                  <HookTextField
                    name='order_date'
                    label='Order Date'
                    control={control}
                    errors={errors}
                    type='date'
                  />
                </Grid>
                <Grid item sm={12} md={4}>
                  <HookTextField
                    name='Required_by'
                    label='Required by Date'
                    control={control}
                    errors={errors}
                    type='date'
                  />
                </Grid>
                <Grid item sm={12} md={6}>
                  <HookCheckbox
                    name='closed'
                    label='Closed'
                    control={control}
                  />
                </Grid>
                <Grid item sm={12} md={6}>
                  <HookTextField
                    name='close_date'
                    label='Closed Date'
                    control={control}
                    errors={errors}
                    type='date'
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid
            container
            direction='row'
            justifyContent='center'
            alignItems='center'
          >
            <Grid item sm={12} md={8}>
              <div className='po-table-section'>
                <div className='mt-3 mb-2 d-flex justify-content-between'>
                  <h6> Details  </h6>
                  <Button variant='text' onClick={onAddNewClick}> Add New  </Button>
                </div>
                <div className='po-table mb-4'>
                  <div className='po-table-head'>
                    <div className='po-head-description'>Descripton</div>
                    <div className='po-head-account'>G/L Account</div>
                    <div className='po-head-QTY'>QTY</div>
                    <div className='po-head-price'>Unit Price</div>
                    <div className='po-head-amount'>Amount</div>
                  </div>
                  {fields.length > 0 ? fields.map((detailSingle, index) => (
                    <div key={detailSingle.id} className='po-table-input'>
                      <div className='po-body-description'>
                        <HookTextField
                          type='text'
                          label='Description*'
                          control={control}
                          errors={errors}
                          name={`details.${index}.description`}
                        />
                      </div>
                      <div className='po-body-account'>
                        <HookSelectField
                          name={`details.${index}.account`}
                          label='G/L*'
                          control={control}
                          errors={errors}
                          options={glCodes}
                          className={classes.select_why}
                        />
                      </div>
                      <div className='po-body-QTY'>
                        <CustomInputField
                          type='number'
                          label='QTY*'
                          value={_.get(watch('details'), `${index}.quantity`)}
                          name={`details.${index}.quantity`}
                          control={control}
                          onChange={(event): void => { handleChange(index, event); }}
                        />
                      </div>
                      <div className='po-body-price'>
                        <CustomInputField
                          label='Unit Price*'
                          value={_.get(watch('details'), `${index}.unit_price`)}
                          name={`details.${index}.unit_price`}
                          type='number'
                          control={control}
                          startAdornment={<StartDollerSign />}
                          onChange={(event): void => { handleChange(index, event); }}
                        />
                      </div>
                      <div className='po-body-amount'>
                        <HookTextField
                          name={`details.${index}.amount`}
                          label='Amount*'
                          control={control}
                          type='number'
                          startAdornment={<StartDollerSign />}
                          disabled
                        />
                      </div>
                      <div className='po-body-cancel' aria-hidden='true' onClick={(): void => { onDeleteDetail(index); }}>
                        <i className='far fa-trash-alt px-2' />
                      </div>
                    </div>
                  )) : (
                    <>
                      <div className='po-table-empty'>
                        Click “Add New” button to add
                      </div>
                      <div className='text-danger text-center mb-1'>
                        Atleast one expense is needed
                      </div>

                    </>
                  )}
                </div>
                <Grid
                  md={12}
                  item
                  container
                  direction='row'
                  alignItems='end'
                  justifyContent='end'
                >
                  <Grid item md={4}>
                    <HookTextField
                      name='sub_total'
                      label='Subtotal'
                      control={control}
                      type='number'
                      startAdornment={<StartDollerSign />}
                      disabled
                    />
                  </Grid>
                </Grid>
                <Grid
                  md={12}
                  item
                  container
                  direction='row'
                  alignItems='end'
                  justifyContent='end'
                >
                  <Grid item md={4}>
                    <HookTextField
                      name='shipping'
                      label='Shipping'
                      control={control}
                      type='number'
                      startAdornment={<StartDollerSign />}
                    />
                  </Grid>
                </Grid>
                <Grid
                  md={12}
                  item
                  container
                  direction='row'
                  alignItems='end'
                  justifyContent='end'
                >
                  <Grid item md={4}>
                    <HookTextField
                      name='taxes'
                      label='Taxes'
                      control={control}
                      type='number'
                      startAdornment={<StartDollerSign />}
                    />
                  </Grid>
                </Grid>
                <Grid
                  md={12}
                  item
                  container
                  direction='row'
                  alignItems='end'
                  justifyContent='end'
                >
                  <Grid item md={4}>
                    <HookTextField
                      name='total'
                      label='Total'
                      control={control}
                      type='number'
                      startAdornment={<StartDollerSign />}
                      disabled
                    />
                  </Grid>
                </Grid>
                <Grid item sm={12} md={12} className='mt-4' justifyContent='right'>
                  <div className='action-btn'>
                    <Button variant='text' className='me-3' onClick={handleCancel}> Cancel  </Button>
                    <PrimayButton type='submit'> Save Details </PrimayButton>
                  </div>
                </Grid>
              </div>
            </Grid>
            {' '}

          </Grid>
        </form>
      </div>
    </div>
  );
}

export default EditPurchaseOrder;
