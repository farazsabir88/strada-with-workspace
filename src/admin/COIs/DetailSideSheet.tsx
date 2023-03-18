/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import * as React from 'react';
import EditIcon from '@mui/icons-material/Edit';
import ClearIcon from '@mui/icons-material/Clear';
import Paper from '@mui/material/Paper';
import moment from 'moment';
import { IconButton, Stack } from '@mui/material';
import type { IeditCOIs } from '../AdminFormTypes';
import type { IstatusColors } from './types';

interface Iprops {
  viewProperties: IeditCOIs | undefined;
  showSidesheet: () => void;
  openEditModal: () => void;
  statusColors: IstatusColors[];
}
export default function DetailSideSheet(props: Iprops): JSX.Element {
  const {
    viewProperties, showSidesheet, openEditModal, statusColors,
  } = props;

  const statusColor = statusColors.filter((item) => item.status === viewProperties?.status);
  const isValid = statusColor.length > 0 && statusColor;
  return (

    <Paper className='detail-sidesheet-cois-paper'>
      <div className='d-flex justify-content-between align-items-start'>
        <p className='vendor-name'>
          {' '}
          {viewProperties?.insured}
        </p>
        <Stack direction='row' spacing={2.5}>
          <IconButton onClick={openEditModal}>
            {' '}
            <EditIcon className='icons' />
          </IconButton>
          <IconButton onClick={showSidesheet}><ClearIcon className='icons' /></IconButton>

        </Stack>
      </div>
      <div className='outer-tab-body'>
        <div className='tab-body coil'>
          <div className='company-cate'>
            <div className='title-cois'>Company</div>
            <div className='value-cois'>{viewProperties?.insured !== '' ? viewProperties?.insured : '---'}</div>
          </div>
          <div className='company-cate'>
            <div className='title-cois'>Category</div>
            <div className='value-cois'>
              {viewProperties?.vendor_category !== null ? viewProperties?.vendor_category : '---'}
            </div>
          </div>
          <div className='company-cate'>
            <div className='title-cois'>Expires</div>
            <div
              className='value-cois'
            >
              {viewProperties?.general_liability_exp_date !== null ? moment(viewProperties?.general_liability_exp_date).format(
                'MM/DD/YYYY',
              ) : '---'}

            </div>
          </div>
          <div className='company-cate'>
            <div className='title-cois'>Date added</div>
            <div className='value-cois'>
              {moment(viewProperties?.created_at).format(
                'MM/DD/YYYY',
              )}
              {' '}

            </div>
          </div>
          <div className='company-cate'>
            <div className='title-cois'>Status</div>
            <div
              className='status-values-cois'
              style={{
                color: isValid ? statusColor[0].color : '#2f2f2f',
                background: isValid ? statusColor[0].background : '#fffff',
              }}
            >
              {viewProperties?.status}
            </div>

          </div>
          <div className='company-cate'>
            <div className='title-cois'>G/L Account</div>
            <div className='value-cois'>
              {viewProperties?.gl_accounts !== null ? viewProperties?.gl_accounts : '---'}
            </div>
          </div>
        </div>
      </div>
    </Paper>

  );
}
