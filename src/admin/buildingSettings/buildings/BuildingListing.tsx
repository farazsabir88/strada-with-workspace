/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import React, { useState, useMemo } from 'react';
import {
  IconButton, Divider, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
} from '@mui/material';
import PrimayButton from 'shared-components/components/PrimayButton';
import SecondaryButton from 'shared-components/components/SecondaryButton';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useSelector, useDispatch } from 'react-redux';
import Popper from '@mui/material/Popper';
import PopupState, { bindToggle, bindPopper } from 'material-ui-popup-state';
import Fade from '@mui/material/Fade';
import Paper from '@mui/material/Paper';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import type { Cell } from 'react-table';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CustomTable from 'shared-components/tables/CustomTable';
import StradaSearch from 'admin/buildingSection/budget-calendar/components/StradaSearch';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import type { AxiosResponse } from 'axios';
import StradaLoader from 'shared-components/components/StradaLoader';
import { setAllBuildings } from 'admin/store/allBuildings';
import type { RootState } from 'mainStore';
import type { IDataObject } from 'formsTypes';
import type { IBuildingsResponse } from './types';
import './_viewBuilding.scss';

export default function BuildingListing(): JSX.Element {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const [search, setSearch] = useState<string>('');
  const [open, setOpen] = useState<boolean>(false);
  const [buildingID, setBuildingID] = useState<number | string>(0);

  const currentWorkspace = useSelector(
    (state: RootState) => state.workspaces.currentWorkspace.currentWorkspace,
  );
  const currentUserRole = useSelector((state: RootState) => state.workspaces.userPermission.currentUserRole);

  const { data, isLoading } = useQuery(
    ['get/buildings', search, currentWorkspace.id],
    async () => axios({
      url: `api/building/?workspace=${currentWorkspace.id}`,
      method: 'get',
      params: {
        search,
      },
    }),
    {
      select: (res: AxiosResponse<IBuildingsResponse>) => res.data.detail,
      onSuccess: (res) => dispatch(setAllBuildings(res)),
    },
  );
  const { mutate: deleteBuilding, isLoading: deleteLoader } = useMutation(
    async (id: number | string) => axios({
      url: `/api/building/${id}/`,
      method: 'delete',
    }),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries('get/buildings').then();
        setOpen(false);
        enqueueSnackbar('Building deleted successfully');
      },
    },
  );
  const getBuildingPagePermissions = (): boolean => {
    if (currentUserRole !== null) {
      if (currentUserRole.role !== 2) {
        return true;
      }
      return false;
    }
    return true;
  };

  const columns = useMemo(
    () => [
      {
        Header: 'Address',
        accessor: 'address',
        width: '23%',
        Cell: (cell: Cell<IDataObject>): JSX.Element => {
          const { value, row } = cell;
          const { original } = row;
          const newVal: string = value;
          return (
            <div
              style={{ color: '#00CFA1' }}

            >
              {getBuildingPagePermissions()
                ? (
                  <p
                    aria-hidden='true'
                    onClick={(): void => {
                      navigate('/workspace/buildings/editBuilding', { state: original });
                    }}
                  >
                    {' '}
                    {newVal}

                  </p>
                )
                : (
                  <p>
                    {' '}
                    {newVal}
                  </p>
                )}
            </div>
          );
        },
      },
      {
        Header: 'City',
        accessor: 'city',
        width: '11%',
      },
      {
        Header: 'State/Territory',
        accessor: 'state',
        width: '12%',
      },
      {
        Header: 'Country',
        accessor: 'country',
        width: '12%',
      },
      {
        Header: 'Contact Person',
        accessor: 'contact_first_name',
        width: '17%',
        Cell: (cell: Cell<IDataObject>): JSX.Element => {
          const { row } = cell;
          const { original } = row;
          return (
            <div>
              {`${original.contact_first_name} ${original.contact_last_name}`}
            </div>
          );
        },
      },
      {
        Header: 'Email',
        accessor: 'contact_email',
        width: '23%',
        Cell: (cell: Cell<IDataObject>): JSX.Element => {
          const { value } = cell;
          const newVal: string = value;
          return (
            <div
              style={{ color: '#00CFA1', wordBreak: 'break-word' }}
            >
              {newVal}
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
                            <Paper className='checklist-list-popover'>
                              <div
                                className='chart-btn'
                                onClick={(): void => {
                                  navigate('/workspace/buildings/viewBuilding', { state: original });
                                  popupState.close();
                                }}
                                aria-hidden='true'
                              >
                                <VisibilityIcon className='edit-delete-icon' />
                                <span className='edit-delete-text '> View</span>
                              </div>
                              {getBuildingPagePermissions()
                              && (
                                <>
                                  <div
                                    className='chart-btn'
                                    onClick={(): void => {
                                      navigate('/workspace/buildings/editBuilding', { state: original });
                                      popupState.close();
                                    }}
                                    aria-hidden='true'
                                  >
                                    <EditIcon className='edit-delete-icon' />
                                    <span className='edit-delete-text '>
                                      Edit
                                    </span>
                                  </div>
                                  <div
                                    className='chart-btn'
                                    onClick={(): void => {
                                      setOpen(true);
                                      setBuildingID(original.id);
                                      popupState.close();
                                    }}
                                    aria-hidden='true'
                                  >
                                    <DeleteIcon className='edit-delete-icon' />
                                    <span className='edit-delete-text '>
                                      Delete
                                    </span>
                                  </div>
                                </>
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
    ],
    [currentWorkspace],
  );

  return (
    <>
      {data?.length === 0 && (
        <div className='empty-array-wrapper'>
          <p>No properties here</p>
          {getBuildingPagePermissions()
              && (
                <div className='create-new-button'>
                  <PrimayButton
                    onClick={(): void => {
                      navigate('/workspace/create-building');
                    }}
                  >
                    Create new
                  </PrimayButton>
                </div>
              )}
        </div>
      )}
      {data?.length !== 0 && (
        <div className='tasks-wrapper' style={{ marginTop: '78px' }}>
          <StradaLoader open={isLoading} />
          <StradaLoader open={deleteLoader} />
          <div className='header'>
            <Typography className='header-text'>Properties</Typography>
            <div className='right-side d-flex align-items-center'>
              <div className='search-wrapper'>
                <StradaSearch value={search} setSearch={setSearch} placeholder='Search' />
              </div>
              {getBuildingPagePermissions()
              && (
                <div className='ms-4'>
                  <PrimayButton
                    onClick={(): void => {
                      navigate('/workspace/create-building');
                    }}
                  >
                    Create new
                  </PrimayButton>
                </div>
              )}
            </div>
          </div>
          <div className='vendor-table-wrapper'>
            <Divider sx={{ mt: 3, mb: 0.9 }} />

            <CustomTable
              {...{
                columns,
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                data: data !== undefined ? data : [],
              }}
            />
          </div>
        </div>
      )}
      <Dialog
        open={open}
        onClose={(): void => { setOpen(false); }}
        fullWidth
        maxWidth='xs'
        PaperProps={{
          style: {
            minWidth: '530px',
          },
        }}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>
          <h3 className='dialog-heading-delete'> Delete property</h3>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description' className='dialog-desc-building'>
            <p>
              Delete will remove property information permanently along with any:
            </p>
            <ul>
              <li>
                Events
              </li>
              <li>
                RFP
              </li>
              <li>
                Checklist
                {' '}

              </li>
              <li>
                COI

              </li>
              <li>
                PO
              </li>
            </ul>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <SecondaryButton className='secondary-btn-secondary' onClick={(): void => { setOpen(false); }}>Cancel</SecondaryButton>
          <div style={{ minWidth: '64px', marginLeft: '10px' }}>
            <PrimayButton onClick={(): void => { deleteBuilding(buildingID); }}>Delete</PrimayButton>
          </div>

        </DialogActions>
      </Dialog>
    </>
  );
}
