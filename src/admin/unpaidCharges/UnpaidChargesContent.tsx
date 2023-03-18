/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import React, { useEffect, useMemo, useState } from 'react';
import { useQuery, useMutation } from 'react-query';
import type { AxiosResponse } from 'axios';
import axios from 'axios';
import _ from 'lodash';
import { useSelector } from 'react-redux';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import type { Cell } from 'react-table';
import { Stack, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import EmailIcon from '@mui/icons-material/Email';
import DeleteIcon from '@mui/icons-material/Delete';
import StradaLoader from 'shared-components/components/StradaLoader';
import CustomTable from 'shared-components/tables/CustomTable';
import PrimayButton from 'shared-components/components/PrimayButton';
import type { RootState } from 'mainStore';
import StradaSearch from 'shared-components/components/StradaSearch';
import type { IDataObject } from 'formsTypes';
import { decrypt } from 'shared-components/hooks/useEncryption';
import CreateInvoiceDialog from './CreateInvoiceDialog';
import type { ItenantData, Iresponse } from './types';

export default function UnpaidChargesContent(): JSX.Element {
  const [search, setSearch] = useState<string>('');
  const [open, setOpen] = useState<boolean>(false);
  const [range, setRange] = useState<string[]>([]);
  const [data, setData] = useState<ItenantData[]>([]);
  const currentBuilding = useSelector((state: RootState) => state.workspaces.currentBuilding);
  const { enqueueSnackbar } = useSnackbar();

  const checkedValues: ItenantData[] = useMemo(() => [], []);
  const { mutate: getTenantData, isLoading: deleteLoader } = useMutation(
    async () => axios({
      url: '/api/unpaid-charges/get_tenant_data/',
      method: 'post',
      data: {
        id: currentBuilding.id,
        past_due_date: JSON.stringify(range),
        property_id: currentBuilding.yardi_code,
      },
    }),
    {
      onSuccess: (res) => {
        const { result } = res.data;
        const resultData: Iresponse[] = result;
        const tenant = resultData.map((item) => item.tenant_data);
        setData(tenant);
        enqueueSnackbar('Success');
      },
    },
  );

  useEffect(() => {
    if (range.length > 0 && currentBuilding.yardi_connected) {
      getTenantData();
    }
  }, [range]);

  const handleCheck: (obj: ItenantData, value: boolean) => void = (obj, value) => {
    if (value) {
      checkedValues.push(obj);
    } else {
      _.remove(checkedValues, obj);
    }
  };

  const columns = useMemo(() => [
    {
      Header: <div className='d-flex align-center dynamic-header'>
        <FormControlLabel
          control={(
            <Checkbox
              defaultChecked={false}
              onChange={(e): void => {
                // do something
              }}
            />
          )}
          label=''
        />
        {checkedValues.length > 0
          ? (
            <Stack direction='row' spacing={3}>
              <Typography className='table-header-name'>
                {checkedValues.length + 1}
                Selected
              </Typography>
              <Typography className='header-icon'>
                <span><EmailIcon className='email-icon' /></span>
                Send Email
              </Typography>
              <Typography className='header-icon'>
                <span><DeleteIcon className='delete-icon' /></span>
                Delete
              </Typography>
            </Stack>
          )
          : <Typography className='table-header-name'>Name</Typography> }

      </div>,
      accessor: 'FirstName',
      Cell: (cell: Cell<IDataObject>): JSX.Element => {
        const { row } = cell;
        const { original } = row;
        return (
          <div className='d-flex align-center'>
            <FormGroup>
              <FormControlLabel
                control={(
                  <Checkbox
                    onChange={(e): void => {
                      handleCheck(original, e.target.checked);
                    }}
                  />
                )}
                label=''
              />
            </FormGroup>
            {original.FirstName}
                &nbsp;
            {original.LastName}
          </div>
        );
      },
    },
    {
      Header: 'Email',
      accessor: 'Email',
    },
    {
      Header: 'Status',
      accessor: 'Status',
    },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [data, checkedValues]);

  return (
    <div className='unpaid-charges-wrapper'>
      <CreateInvoiceDialog
        open={open}
        handleClose={(): void => { setOpen(false); }}
        setMainRange={setRange}
      />

      <div className='unpaid-charges-header'>
        <h6> Unpaid Charges </h6>
        <div className='right-side'>
          <div className='search-wrapper'>
            <StradaSearch value={search} setSearch={setSearch} placeholder='Search' />
          </div>

          <div className='button-wrapper'>
            <PrimayButton onClick={(): void => { setOpen(true); }}> Create New Invoice </PrimayButton>
          </div>

        </div>

      </div>

      <div>
        {data.length > 0
          ? <CustomTable {...{ columns, data }} selection />
          : (
            <div className='no-unpaid-charges'>
              <Typography>No Unpaid Charges Exist</Typography>
            </div>
          )}

      </div>
      {/* <StradaLoader open={isLoading} /> */}
    </div>
  );
}
