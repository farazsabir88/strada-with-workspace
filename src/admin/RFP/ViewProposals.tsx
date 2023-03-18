/* eslint-disable no-nested-ternary */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-props-no-spreading */
import {
  ClickAwayListener,
  Fade, Grid, Typography, IconButton, Paper, Popper,
} from '@mui/material';
import React, { useState, useMemo } from 'react';
import StradaSearch from 'admin/buildingSection/budget-calendar/components/StradaSearch';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useQuery } from 'react-query';
import axios from 'axios';
import type { AxiosResponse } from 'axios';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import PopupState, { bindToggle, bindPopper } from 'material-ui-popup-state';
import type { IDataObject } from 'formsTypes';
import type { Cell } from 'react-table';
import moment from 'moment';
import CustomTable from 'shared-components/tables/CustomTable';
import type { RFPListing, RFPProposal, RFPProposalQuestion } from './types';
import ProposalsCarousel from './ProposalsCarousel';
import ViewSingleProposal from './ViewSingleProposal';

interface IProps {
  rfpData: RFPListing | undefined;
  handleBack: () => void;
}

export default function ViewProposals(props: IProps): JSX.Element {
  const { rfpData, handleBack } = props;
  const [search, setSearch] = useState('');
  const [selectedProposal, setSelectedProposal] = useState<RFPProposal>();
  const [showProposal, setShowProposal] = useState<boolean>(false);
  const [allowSearch, setAllowSearch] = useState<boolean | null>(null);

  const { data: rfpProposalData = [], isLoading } = useQuery(['get/rfp-proposal-listing', search], async () => axios({
    url: `/api/rfp/proposal/?rfp_id=${rfpData?.id}`,
    method: 'GET',
    params: { search },
  }), {
    select: (res: AxiosResponse<RFPProposal[]>) => res.data,
    onSuccess: (res: RFPProposal[]) => {
      if (res.length === 0 && search === '') {
        setAllowSearch(false);
      } else {
        setAllowSearch(true);
      }
    },
    enabled: allowSearch !== false,
  });

  const { data: rfpProposalQuestionsData = [] } = useQuery(['get/rfp-proposal-questions', search], async () => axios({
    url: `/api/rfp/proposal/questions/?rfp_id=${rfpData?.id}`,
    method: 'GET',
    params: { search },
  }), {
    select: (res: AxiosResponse<RFPProposalQuestion[]>) => res.data,
    enabled: allowSearch !== false,
  });

  const onViewProposalClick = (data: IDataObject): void => {
    // const info = rfpProposalData.filter((rfp: RFPProposal) => rfp.id === data.id);
    setSelectedProposal(data);
    setShowProposal(true);
  };

  const handleSingleProposalBack = (): void => {
    setShowProposal(false);
  };

  const columns = useMemo(() => [
    {
      Header: 'Bids',
      accessor: 'vendor',
      width: '18%',
    },
    {
      Header: 'Contact',
      accessor: 'contact_name',
      width: '14%',
    },
    {
      Header: 'Phone',
      accessor: 'phone',
      width: '14%',
    },
    {
      Header: 'Email',
      accessor: 'email',
      width: '27%',
    },
    {
      Header: 'Date Received',
      accessor: 'created_at',
      width: '14%',
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
      Header: 'Amount',
      accessor: 'total_amount',
      width: '8%',
      Cell: (cell: Cell<IDataObject>): JSX.Element => {
        const { value } = cell;
        const newVal: string | null = value;
        return (
          <div>
            {`$${newVal}`}
          </div>
        );
      },
    },
    {
      Header: '',
      accessor: 'account_new',
      width: '2%',
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
                              View Proposal
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
      { !showProposal && (
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
            <div className='header-wrapper' style={{ marginTop: '20px', display: 'flex' }}>
              <div className='d-flex'>
                <span>
                  <ArrowBackIcon className='cursor-pointer' aria-hidden='true' onClick={(): void => { handleBack(); }} />
                </span>
                <div style={{ marginLeft: '5px' }}>
                  <h6 style={{ fontSize: '18px', color: 'black', fontWeight: 'normal' }}>{rfpData?.event_name}</h6>
                  <h6 style={{ fontSize: '12px', marginTop: '6px' }}>
                    Budgeted:
                    {rfpData?.budget !== null ? ` $${rfpData?.budget}` : ''}
                  </h6>
                </div>
              </div>
              <div className='header-area'>

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
                                  aria-hidden='true'
                                >
                                  Download Pdf
                                </div>
                                <div
                                  className='chart-btn'
                                  aria-hidden='true'
                                >
                                  Share Link
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

            </div>
            {allowSearch === false || isLoading ? (
              <div className='building-settings-templates'>
                <div className='header-area-empty'>
                  <p style={{ fontWeight: 'bold' }}>Waiting for Proposal Submissions</p>
                </div>
              </div>
            )
              : (
                <>
                  <div className='table-divider'>
                    <CustomTable {...{ columns, data: rfpProposalData }} />
                  </div>
                  <ProposalsCarousel rfpProposalData={rfpProposalData} questions={rfpProposalQuestionsData} />
                </>
              ) }
          </div>

        </div>
      )}
      {showProposal && (
        <ViewSingleProposal
          questions={rfpProposalQuestionsData}
          rfpData={rfpData}
          proposalData={selectedProposal}
          handleBack={handleSingleProposalBack}
        />
      ) }
    </>
  );
}
