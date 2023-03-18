import { Grid, Typography } from '@mui/material';
import axios from 'axios';
import type { AxiosResponse } from 'axios';
import React, { useState, useMemo } from 'react';
import { useQuery } from 'react-query';
import StradaSearch from 'admin/buildingSection/budget-calendar/components/StradaSearch';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CustomTable from 'shared-components/tables/CustomTable';
import type { IDataObject } from 'formsTypes';
import type { Cell } from 'react-table';
import moment from 'moment';
import type { RFPActivityListing, RFPListing } from './types';

interface IProps {
  rfpData: RFPListing | undefined;
  handleBack: () => void;
}

export default function ViewActivity(props: IProps): JSX.Element {
  const { rfpData, handleBack } = props;
  const [search, setSearch] = useState('');

  const { data: rfpActivityData = [] } = useQuery(['get/rfp-activity-listing', search], async () => axios({
    url: `/api/rfp/activity-log/?rfp_id=${rfpData?.id}`,
    method: 'GET',
    params: { search },
  }), {
    select: (res: AxiosResponse<RFPActivityListing[]>) => res.data,
  });

  const columns = useMemo(() => [
    {
      Header: 'Activity',
      accessor: 'activity',
      width: '25%',
    },
    {
      Header: 'Vendor',
      accessor: 'vendor',
      width: '60%',
    },
    {
      Header: 'Date',
      accessor: 'date',
      width: '15%',
      Cell: (cell: Cell<IDataObject>): JSX.Element => {
        const { value } = cell;
        const newVal: string | null = value;
        return (
          <div>
            {newVal !== null ? moment(new Date(`${newVal}T00:00:00`)).format('MM/DD/YYYY') : ''}
          </div>
        );
      },
    },
  ], []);

  return (
    <div
      style={{
        display: 'flex', width: '100%', margin: '42px 1.5rem 1.5rem 1.5rem',
      }}
      className='Main-purchase-orders'
    >
      <div className='purchases'>
        <Grid container mt={2} spacing={3} className='search-field-wrapper'>
          <Grid item sm={6}>
            <Typography style={{
              fontSize: '24px', fontWeight: '550', fontFamily: 'roboto-medium', color: 'rgba(33, 33, 33, 0.87)',
            }}
            >
              RFPs
            </Typography>
          </Grid>
          <Grid item sm={6} className='search-field'>
            <StradaSearch
              value={search}
              setSearch={setSearch}
              placeholder='Search'
              className='ms-auto'
            />
          </Grid>
        </Grid>
        <div style={{ marginTop: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span>
              <ArrowBackIcon className='cursor-pointer' aria-hidden='true' onClick={(): void => { handleBack(); }} />
            </span>
            <h6 style={{
              fontSize: '24px', color: 'black', fontWeight: 'normal', marginLeft: '5px',
            }}
            >
              Activity
            </h6>
          </div>
        </div>
        <div className='table-divider'>
          <CustomTable {...{ columns, data: rfpActivityData }} />
        </div>
      </div>
    </div>
  );
}
