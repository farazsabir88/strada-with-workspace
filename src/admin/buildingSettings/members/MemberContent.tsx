/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-props-no-spreading */
import {
  Grid, Typography, Button, Stack, Avatar, IconButton, Popper, ClickAwayListener, Fade, Paper, Chip,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import React, { useMemo, useState } from 'react';
import {
  useQueryClient, useMutation, useQuery,
} from 'react-query';
import StradaLoader from 'shared-components/components/StradaLoader';
import StradaSearch from 'admin/buildingSection/budget-calendar/components/StradaSearch';
import AddIcon from 'assests/images/add_icon.svg';
import type { AxiosResponse } from 'axios';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import type { SelectChangeEvent } from '@mui/material/Select';
import Select from '@mui/material/Select';
import axios from 'axios';
import { useSelector } from 'react-redux';
import type { RootState } from 'mainStore';
import { makeStyles } from '@mui/styles';
import PopupState, { bindToggle, bindPopper } from 'material-ui-popup-state';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import type { IDataObject } from 'formsTypes';
import type { Cell } from 'react-table';
import CustomTable from 'shared-components/tables/CustomTable';
import PrimayButton from 'shared-components/components/PrimayButton';
import type { IMemberData, IMemberListingResponse } from './types';
import InviteMember from './InviteMember';

const useStyles = makeStyles({
  select_design: {
    '&. MuiSelect-select': {
      marginTop: '2px',
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderStyle: 'none',
    },
  },
});

export default function MemberContent(): JSX.Element {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const user = useSelector((state: RootState) => state.auth.user);

  const [search, setSearch] = useState('');
  const currentWorkspace = useSelector((state: RootState) => state.workspaces.currentWorkspace.currentWorkspace);
  const menuItems = ['Owner', 'Admin', 'Member', 'Engineer'];
  const [memberData, setMemberData] = useState<IMemberData[]>([]);
  const [userMember, setUserMember] = useState<IMemberData>();
  const [open, setOpen] = React.useState(false);
  const handleInviteOpen = (): void => { setOpen(true); };
  const handleInviteClose = (): void => { setOpen(false); };

  const { isLoading: getLoader } = useQuery(
    ['get/members', search],
    async () => axios({
      url: `api/workspace-member/?workspace=${currentWorkspace.id}`,
      method: 'get',
      params: { search },
    }),
    {
      select: (res: AxiosResponse<IMemberListingResponse>) => res.data.detail,
      onSuccess: (res: IMemberData[]) => {
        setMemberData(res);
        const youMember = res.filter((member) => member.user_info.id === user.id);
        if (youMember.length > 0) {
          setUserMember(youMember[0]);
        }
      },
    //   enabled: currentBuilding.id !== 0,
    },
  );

  const { mutate: updatePermissions, isLoading: updateLoader } = useMutation(async ({ role, id }: { role: number; id: number | string }) => axios({
    url: `api/workspace-member/${id}/`,
    method: 'patch',
    data: { role },
  }), {
    onSuccess: async () => {
      await queryClient.invalidateQueries('get/members').catch().then();
      enqueueSnackbar('Updated Succsessfully!');
    },
    onError: () => {
      enqueueSnackbar('Failed!');
    },
  });

  const handleChange = (event: SelectChangeEvent, id: number | string): void => {
    const payload = {
      role: Number(event.target.value),
      id,
    };
    updatePermissions(payload);
  };

  const getPermissionDisableCheck = (position: number, itemRole: number): boolean => {
    if (userMember === undefined) {
      return true;
    }
    if (userMember.role > 2) {
      return true;
    }
    if (userMember.role >= itemRole) {
      return true;
    }
    if (userMember.role > position) {
      return true;
    }
    return false;
  };

  const { mutate: reinviteMember } = useMutation(
    async (id: number | string) => axios({
      url: `api/workspace-reinvite/${id}/`,
      method: 'PATCH',
    }),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries('get/members').then();
        enqueueSnackbar('Invite Resent Successfully');
      },
      onError: () => {
        enqueueSnackbar('Error in Reinviting');
      },
    },
  );

  const { mutate: deleteMember, isLoading: deleteLoader } = useMutation(
    async (id: number | string) => axios({
      url: `api/workspace-member/${id}/`,
      method: 'DELETE',
    }),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries('get/members').then();
        enqueueSnackbar('Deleted Successfully');
      },
      onError: () => {
        enqueueSnackbar('Error deleting data.');
      },
    },
  );

  const getRemoveButtonAccess = (itemRole: number): boolean => {
    if (userMember !== undefined && (userMember.role === 0 || userMember.role === 1) && userMember.role < itemRole) {
      return true;
    }
    return false;
  };

  const columns = useMemo(() => [
    {
      Header: 'Name',
      accessor: 'name',
      Cell: (cell: Cell<IDataObject>): JSX.Element => {
        const { row } = cell;
        const { original } = row;
        return (
          <Stack direction='row' spacing={1} className='d-flex align-items-center'>
            {!original.user_info.pending ? <Avatar src={`${process.env.REACT_APP_IMAGE_URL}/api/${original.user_info.avatar}`} className='people-avatar' /> : <div style={{ width: '40px' }} />}

            <Stack direction='column'>
              <p className='people-text-h1'>
                {original.user_info.name}
                {user.id === original.user_info.id && ' (you)'}
              </p>
              <p className='people-text-h2' style={{ color: 'rgba(33, 33, 33, 0.6)' }}>
                {original.user_info.email}
                {original.user_info.pending && (
                  <span className='ms-2'>
                    <Chip label='Pending' style={{ color: 'rgba(33, 33, 33, 0.6)' }} />
                  </span>
                )}
              </p>
            </Stack>
          </Stack>
        );
      },
    },
    {
      Header: 'Permission',
      accessor: 'role',
      Cell: (cell: Cell<IDataObject>): JSX.Element => {
        const { row } = cell;
        const { original } = row;
        return (
          <FormControl sx={{ mt: 1, minWidth: 120 }}>
            <Select
              value={String(original.role)}
              className={classes.select_design}
              onChange={(e): void => { handleChange(e, original.id); }}
            >
              { userMember !== undefined && menuItems.map((option, i) => (
                <MenuItem key={`people-item-${option}`} value={String(i)} disabled={getPermissionDisableCheck(i, original.role)}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
                                navigator.clipboard.writeText(original.user_info.email);
                                enqueueSnackbar('Copied');
                                popupState.close();
                              }}
                              aria-hidden='true'
                            >
                              Copy Email
                            </div>
                            {original.user_info.pending && getRemoveButtonAccess(original.role)
                              && (
                                <div
                                  className='chart-btn'
                                  onClick={(): void => {
                                    reinviteMember(original.id);
                                    popupState.close();
                                  }}
                                  aria-hidden='true'
                                >
                                  Re-Invite
                                </div>
                              )}
                            {getRemoveButtonAccess(original.role) && (
                              <div
                                className='chart-btn'
                                onClick={(): void => {
                                  deleteMember(original.id);
                                  popupState.close();
                                }}
                                aria-hidden='true'
                              >
                                Remove
                              </div>
                            )}
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
  ], [menuItems, user.id]);

  return (
    <div className='vendor-contacts-wrapper'>
      <StradaLoader open={deleteLoader || updateLoader || getLoader} />

      <Grid container mt={2} spacing={3} className='search-field-wrapper d-flex justify-content-between'>
        <Grid item sm={6}>
          <Typography
            className='search-field-typo '
            style={{
              fontFamily: 'Roboto-Medium', fontSize: '24px', color: 'rgba(33, 33, 33, 0.87)',
            }}
          >
            Members

          </Typography>
        </Grid>
        <Grid item sm={6} className='d-flex justify-content-end'>
          <StradaSearch
            value={search}
            setSearch={setSearch}
            placeholder='Search'
            className='w-70'
          />
          {userMember !== undefined && userMember.role < 2 && (
            <Button onClick={handleInviteOpen} className='text-transform-none text-white ms-3' variant='contained'>
              <img src={AddIcon} alt='' className='me-2' />
              Invite
            </Button>
          )}

        </Grid>
      </Grid>

      { memberData.length > 0 && (
        <div className='mt-3'>
          <CustomTable {...{ columns, data: memberData }} />
        </div>
      )}
      { memberData.length === 0 && !getLoader && search !== '' && (
        <div className='empty-array-wrapper'>
          <p>No data is found matching your search</p>
          <div className='create-new-button'>
            <PrimayButton
              onClick={(): void => { setSearch(''); }}
            >
              Reset Search
            </PrimayButton>
          </div>
        </div>
      )}

      <InviteMember open={open} handleClose={handleInviteClose} />
    </div>
  );
}
