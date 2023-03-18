/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-props-no-spreading */
import {
  Grid, Typography, IconButton, Popper, ClickAwayListener, Fade, Paper,
} from '@mui/material';
import PopupState, { bindToggle, bindPopper } from 'material-ui-popup-state';
import React, { useState } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import StradaSearch from 'admin/buildingSection/budget-calendar/components/StradaSearch';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import moment from 'moment';
import type { RFPListing, RFPProposal, RFPProposalQuestion } from './types';

interface IProps {
  proposalData: RFPProposal | undefined;
  rfpData: RFPListing | undefined;
  handleBack: () => void;
  questions: RFPProposalQuestion[] | undefined;
}

function ArrowDown(): JSX.Element {
  return (
    <svg width='11' height='6' viewBox='0 0 11 6' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path d='M0.484375 0.984375H10.5156L5.5 6L0.484375 0.984375Z' fill='url(#paint0_linear_5392_1574)' />
      <defs>
        <linearGradient id='paint0_linear_5392_1574' x1='-6.5' y1='15' x2='17.5' y2='15' gradientUnits='userSpaceOnUse'>
          <stop stopColor='#00A4AB' />
          <stop offset='1' stopColor='#00CFA1' />
        </linearGradient>
      </defs>
    </svg>
  );
}

function ViewSingleProposal(props: IProps): JSX.Element {
  const {
    proposalData, handleBack, rfpData, questions,
  } = props;
  const [search, setSearch] = useState('');
  const [hideFiles, setHideFiles] = useState(false);

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
        <div className='header-wrapper' style={{ marginTop: '20px', display: 'flex' }}>
          <div className='d-flex'>
            <span>
              <ArrowBackIcon className='cursor-pointer' aria-hidden='true' onClick={(): void => { handleBack(); }} />
            </span>
            <div style={{ marginLeft: '5px' }}>
              <h6 style={{ fontSize: '18px', color: 'black', fontWeight: 'normal' }}>{rfpData?.event_name}</h6>
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

        <h5 className='overview'>Overview</h5>
        <div className='attach-div'>
          <div aria-hidden='true' onClick={(): void => { setHideFiles(!hideFiles); }}><ArrowDown /></div>
          <div>
            <h5>Attachment</h5>
            {!hideFiles
              ? proposalData?.proposal_answers.map((v) => (
                v.filename != null ? <h6 key={v.created_at}><a href={`${process.env.REACT_APP_IMAGE_URL}${v.file}`}>{v.filename}</a></h6> : null
              ))
              : null}
          </div>
        </div>
        <div className='bottomDiv' style={{ marginTop: '80px' }}>
          <div className='width-33'>
            <p className='border-botttom' style={{ fontSize: '20px', color: '#212121' }}>{proposalData?.vendor}</p>
            <p className='border-botttom'>Price</p>
            <p className='border-botttom'>Contacts</p>
            {questions?.map((item) => (
              item.field_type !== 'signature'
                ? item.field_type === 'survey'
                  ? item.survey_questions.map((q) => (
                    <p key={q.id} className='border-botttom'>{q.question}</p>
                  ))
                  : <p key={item.id} className='border-botttom'>{item.label}</p> : null
            ))}
          </div>
          <div className='width-66'>
            <div style={{ borderLeft: '1px solid #E4E4E4', width: '100%' }}>
              <p className='border-botttom' style={{ fontSize: '20px', color: '#212121', borderTop: 'none' }} />
              <p className='border-botttom' style={{ fontSize: '24px', color: '#00CFA1' }}>
                <sup style={{ fontSize: '10px' }}>$</sup>
                {proposalData?.total_amount}
              </p>
              <p className='border-botttom'>
                {proposalData?.contact_name}
                <br />
                {' '}
                {proposalData?.email}
              </p>
              {questions?.map((val) => proposalData?.proposal_answers.map((v) => (
                val.field_type !== 'signature'
                  ? val.id === v.rfp_question
                    ? v.file != null
                      ? <p key={v.id} className='border-botttom'><a style={{ color: '#4DC6FA' }} href={`${process.env.REACT_APP_IMAGE_URL}${v.file}`}>{v.filename}</a></p> : v.question === 'Day'
                        ? <p key={v.id} className='border-botttom'>{moment(new Date(`${v.answer}T00:00:00`)).format('MM/DD/YYYY')}</p>
                        : <p key={v.id} className='border-botttom'>{v.answer}</p>
                    : null : null
              )))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewSingleProposal;
