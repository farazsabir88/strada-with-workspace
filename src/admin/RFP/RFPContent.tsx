/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-console */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import type { AxiosResponse } from 'axios';
import {
  ClickAwayListener,
  Fade,
  Grid, IconButton, Paper, Popper,
} from '@mui/material';
import StradaSearch from 'admin/buildingSection/budget-calendar/components/StradaSearch';
import { useNavigate } from 'react-router-dom';
import CustomTable from 'shared-components/tables/CustomTable';
import type { IDataObject } from 'formsTypes';
import type { Cell } from 'react-table';
import moment from 'moment';
import { useSelector } from 'react-redux';
import type { RootState } from 'mainStore';
import PopupState, { bindToggle, bindPopper } from 'material-ui-popup-state';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import BuildingFilter from 'admin/buildingSection/budget-calendar/components/BuildingFilter';
import type { RFPListing } from './types';
import ViewActivity from './ViewActivity';
import ViewProposals from './ViewProposals';

function RFPContent(): JSX.Element {
  const [search, setSearch] = useState('');
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [showProposals, setShowProposals] = useState<boolean>(false);
  const [showActivity, setShowActivity] = useState<boolean>(false);
  const [selectedData, setSelectedData] = useState<RFPListing>();
  const [buildingFilter, setBuildingFilter] = useState<number[]>([]);
  const currentWorkspace = useSelector(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    (state: RootState) => state.workspaces.currentWorkspace.currentWorkspace,
  );
  const { data: rfpData = [] } = useQuery(['get/rfp-listing', search, buildingFilter], async () => axios({
    url: `/api/rfp/?workspace=${currentWorkspace.id}`,
    method: 'GET',
    params: {
      search,
      property: buildingFilter,
    },
  }), {
    select: (res: AxiosResponse<RFPListing[]>) => res.data,
  });

  const onViewProposalClick = (data: RFPListing): void => {
    // const info = rfpData.filter((rfp: RFPListing) => rfp.id === data.id);
    setSelectedData(data);
    setShowActivity(false);
    setShowProposals(true);
  };

  const onViewActivityClick = (data: RFPListing): void => {
    // const info = rfpData.filter((rfp: RFPListing) => rfp.id === data.id);
    setSelectedData(data);
    setShowActivity(true);
    setShowProposals(false);
  };

  const handleBack = (): void => {
    setShowActivity(false);
    setShowProposals(false);
  };

  const { mutate: deleteRFP } = useMutation(async (id: number | string) => axios({
    url: `api/rfp/${id}/`,
    method: 'DELETE',
  }), {
    onSuccess: async () => {
    //   enqueueSnackbar('Vendor COI deleted successfully');
      await queryClient.invalidateQueries('get/rfp-listing')
        .then();
    },
    onError: (): void => {
    //   enqueueSnackbar('Vendor COI delete failed', { variant: 'error' });
    },
  });

  const columns = useMemo(() => [
    {
      Header: 'Event',
      accessor: 'event_name',
      width: '30%',
    },
    {
      Header: 'Property',
      accessor: 'property',
      width: '30%',
      Cell: (cell: Cell<IDataObject>): JSX.Element => {
        const { value } = cell;
        return (
          <div>
            {value.address}
          </div>
        );
      },
    },
    {
      Header: 'Budgeted',
      accessor: 'budget',
      width: '20%',
    },

    {
      Header: 'Date',
      accessor: 'created_at',
      width: '20%',
      Cell: (cell: Cell<IDataObject>): JSX.Element => {
        const { value } = cell;
        const newVal: string | null = value;
        return (
          <div>
            {newVal !== null ? moment(newVal).format('MM/DD/YYYY') : ''}
          </div>
        );
      },
    },
    {
      Header: '',
      accessor: 'account_new',
      width: '5%',
      Cell: (cell: Cell<IDataObject>): JSX.Element => {
        const { row } = cell;
        const { original } = row;
        return (
          <div style={{ textAlign: 'right' }}>
            <PopupState variant='popper' popupId='demo-popup-popper'>
              {(popupState): JSX.Element => (
                <div>
                  <IconButton {...bindToggle(popupState)}>
                    <MoreHorizIcon fontSize='small' />
                  </IconButton>
                  <Popper
                    {...bindPopper(popupState)}
                    transition
                  >
                    {({ TransitionProps }): JSX.Element => (
                      <ClickAwayListener onClickAway={(): void => { popupState.close(); }}>
                        <Fade {...TransitionProps} timeout={350}>
                          <Paper className='rfp-popover'>
                            <div
                              className='chart-btn'
                              onClick={(): void => {
                                onViewProposalClick(original);
                                popupState.close();
                              }}
                              aria-hidden='true'
                            >
                              View Proposals
                            </div>
                            <div
                              className='chart-btn'
                              onClick={(): void => { onViewActivityClick(original); popupState.close(); }}
                              aria-hidden='true'
                            >
                              View Activity
                            </div>
                            <div
                              className='chart-btn'
                              onClick={(): void => { navigate(`/workspace/budget-calendar?eventId=${original.event}`); popupState.close(); }}
                              aria-hidden='true'
                            >
                              Go to Event
                            </div>
                            <div
                              className='chart-btn'
                              onClick={(): void => { deleteRFP(original.id); popupState.close(); }}
                              aria-hidden='true'
                            >
                              Delete
                            </div>
                          </Paper>
                        </Fade>
                      </ClickAwayListener>
                    )}
                  </Popper>
                </div>
              )}
            </PopupState>

          </div>
        );
      },
    },
  ], []);

  return (
    <>
      {!showActivity && !showProposals && (
        <div
          style={{
            display: 'flex', width: '100%', margin: '42px 1.5rem 1.5rem 1.5rem',
          }}
          className='Main-purchase-orders'
        >
          <div className='purchases'>
            <Grid container mt={2} spacing={3} className='search-field-wrapper'>
              <Grid item sm={6}>
                <p className='search-field-typo search-field-rfp-header' style={{ color: '#212121DE' }}>RFPs</p>
              </Grid>
              <Grid item sm={6} className='search-field-rfp'>

                <div className='d-flex align-items-center'>
                  <div className='px-2'>
                    <BuildingFilter
                      buildingFilter={buildingFilter}
                      setBuildingFilter={setBuildingFilter}
                    />
                  </div>
                  <div className='search-wrapper'>
                    <StradaSearch
                      value={search}
                      setSearch={setSearch}
                      placeholder='Search'
                    />
                  </div>

                </div>

              </Grid>
            </Grid>
            <div className='table-divider' style={{ marginTop: '50px' }}>
              <CustomTable {...{ columns, data: rfpData }} />
            </div>
          </div>

        </div>
      )}
      {showActivity && <ViewActivity rfpData={selectedData} handleBack={handleBack} /> }
      {showProposals && <ViewProposals rfpData={selectedData} handleBack={handleBack} /> }
    </>
  );
}

export default RFPContent;
