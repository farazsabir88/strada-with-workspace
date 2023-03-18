/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import React, { useMemo } from 'react';
import { IconButton, Divider, Typography } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import type { AxiosResponse } from 'axios';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Popper from '@mui/material/Popper';
import PopupState, { bindToggle, bindPopper } from 'material-ui-popup-state';
import Fade from '@mui/material/Fade';
import Paper from '@mui/material/Paper';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import type { Cell } from 'react-table';
import { useSnackbar } from 'notistack';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import StradaLoader from 'shared-components/components/StradaLoader';
import CustomTable from 'shared-components/tables/CustomTable';
import PrimayButton from 'shared-components/components/PrimayButton';
import type { RootState } from 'mainStore';
import type { IDataObject } from 'formsTypes';
import { encrypt } from 'shared-components/hooks/useEncryption';
import type { Iresponse } from './types';

export default function UnpaidChagresEmailContent(): JSX.Element {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const currentWorkspace = useSelector(
    (state: RootState) => state.workspaces.currentWorkspace.currentWorkspace,
  );
  const { mutate: deleteUnpaidEmail, isLoading: deleteLoader } = useMutation(
    async (id: number | string) => axios({
      url: `/api/unpaid-charge-template/${id}`,
      method: 'DELETE',
    }),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries('get/unpaid-charge-template').then();
        enqueueSnackbar('Deleted Successfully');
      },
    },
  );

  const columns = useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'template_name',
      },
      {
        Header: 'Author',
        accessor: 'author_name',
      },
      {
        Header: 'Created',
        accessor: 'created_at',
        Cell: (cell: Cell<IDataObject>): JSX.Element => {
          const { value } = cell;
          const newVal: string = value;
          return (
            <div>
              {moment(newVal).format('DD/MM/YYYY')}
            </div>
          );
        },
      },
      {
        Header: '',
        accessor: 'account_new',
        Cell: (cell: Cell<IDataObject>): JSX.Element => {
          const { row } = cell;
          const { original } = row;
          return (
            <div
              style={{
                textAlign: 'right',
                marginRight: '1rem',
              }}
            >
              <PopupState variant='popper' popupId='demo-popup-popper'>
                {(popupState): JSX.Element => (
                  <div>
                    <IconButton {...bindToggle(popupState)}>
                      <MoreHorizIcon />
                    </IconButton>
                    <Popper {...bindPopper(popupState)} transition>
                      {({ TransitionProps }): JSX.Element => (
                        <ClickAwayListener
                          onClickAway={(): void => {
                            popupState.close();
                          }}
                        >
                          <Fade {...TransitionProps} timeout={350}>
                            <Paper className='unpaid-email-popover'>
                              <div
                                className='chart-btn'
                                onClick={(): void => {
                                  navigate(`/workspace/settings/unpaid-charges-email/${encrypt(original.id)}`);
                                  popupState.close();
                                }}
                                aria-hidden='true'
                              >
                                <i className='fas fa-pen edit-icon fa-lg edit-delete-icon' />
                                <span className='edit-text'> Edit</span>
                              </div>

                              <div
                                className='chart-btn'
                                onClick={(): void => {
                                  deleteUnpaidEmail(original.id);
                                  popupState.close();
                                }}
                                aria-hidden='true'
                              >
                                <DeleteIcon className='edit-delete-icon' />
                                <span className='delete-text'>
                                  Delete
                                </span>
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
    ],
    [currentWorkspace],
  );

  const { data, isLoading } = useQuery(
    'get/unpaid-charge-template',
    async () => axios({
      url: `/api/unpaid-charge-template/?workspace=${currentWorkspace.id}`,
      method: 'get',
    }),
    {
      enabled: currentWorkspace.id !== 0,
      select: (res: AxiosResponse<Iresponse>) => res.data.detail,
    },
  );

  return (
    <>
      {data?.length === 0 && (
        <div className='empty-array-wrapper'>
          {' '}
          <PrimayButton
            onClick={(): void => {
              navigate('/workspace/settings/unpaid-charges-email/new');
            }}
          >
            Add Template
          </PrimayButton>

        </div>
      )}
      {data?.length !== 0 && (
        <div className='unpaid-email-wrapper'>
          <StradaLoader open={isLoading} />
          <StradaLoader open={deleteLoader} />
          <div className='header'>
            <Typography className='header-text'> Unpaid Charges Emails</Typography>
            <div className='button-wrapper'>
              <PrimayButton
                onClick={(): void => {
                  navigate('/workspace/settings/unpaid-charges-email/new');
                }}
              >
                Add Template
              </PrimayButton>
            </div>
          </div>
          <div className='vendor-table-wrapper'>
            <Divider sx={{ mt: 3, mb: 0.9 }} />

            <CustomTable
              {...{
                columns,
                data: data !== undefined ? data : [],
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
