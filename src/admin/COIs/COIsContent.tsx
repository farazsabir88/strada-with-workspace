/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable consistent-return */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import React, { useEffect, useMemo, useState } from 'react';
import {
  IconButton, Typography, Grid, InputBase,
} from '@mui/material';
import type { KeyboardEvent } from 'react';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
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
import type { BuildingsResponse } from 'admin/buildingSection/building-dashboard/types';
import type {
  Iresponse, IvendorResponse, Idata, IvendorFilter,
} from './types';
import EditCOI from './EditCOIs/EditContent';
import type { IeditCOIs } from '../AdminFormTypes';
import DetailSideSheet from './DetailSideSheet';
import COIsErrorBar from './COIsErrorTemplate/COIsErrorBar';
import VendorSelect from './VendorSelect';
import PropertySelect from './PropertySelect';

export default function UnpaidChagresEmailContent(): JSX.Element {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [openEditModal, setopenEditModal] = React.useState(false);
  const [editData, setEditData] = React.useState<IeditCOIs | undefined>();
  const [viewProperties, setviewProperties] = React.useState<IeditCOIs | undefined>();
  const [showSidesheet, setshowSidesheet] = React.useState(false);
  const [inputText, setInputText] = React.useState('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [search, setSearch] = React.useState('');
  const [filteredData, setFilteredData] = useState<Idata[]>();

  const currentBuilding = useSelector(
    (state: RootState) => state.workspaces.currentBuilding,
  );
  const currentWorkspace = useSelector((state: RootState) => state.workspaces.currentWorkspace.currentWorkspace);

  const { data: getVendorsList = [] } = useQuery(
    'get/vendor',
    async () => axios({
      url: `api/filter/vendor-coi/?workspace=${currentWorkspace.id}`,
      method: 'get',
    }),
    {
      enabled: currentWorkspace.id !== 0,
      select: (res: AxiosResponse<IvendorResponse>) => {
        const list: {
          label: string;
          value: number;
          buildings: number[];
        } [] = [];
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (res !== undefined) {
          res.data.detail.map((vendor) => {
            const obj = {
              label: `${vendor.name ? vendor.name : ''}`,
              value: vendor.id,
              buildings: vendor.buildings,
            };
            list.push(obj);
            return obj;
          });
        }
        return list;
      },
    },
  );

  const { mutate: deleteCOI } = useMutation(async (id: number | string) => axios({
    url: `/api/coi/${id}/`,
    method: 'delete',
  }), {
    onSuccess: async () => {
      await queryClient.invalidateQueries('get/cois').catch()
        .then();
      enqueueSnackbar('Deleted Successfully!');
    },
    onError: () => {
      enqueueSnackbar('Failed!', { variant: 'error' });
    },
  });

  const colors = [
    {
      status: 'No Data',
      color: 'rgb(216, 27, 96)',
      background: 'rgba(216, 27, 96, 0.08)',
    },
    {
      status: 'Success',
      color: '#4CAF50',
      background: 'rgba(76, 175, 80, 0.08)',

    },
    {
      status: 'uncategorized',
      color: 'rgba(33, 150, 243, 0.87)',
      background: 'rgba(33, 150, 243, 0.08)',

    },
    {
      status: 'none',
      color: '#F9A825',
      background: 'rgba(0, 0, 0, 0.08)',

    },
    {
      status: 'Updated',
      color: 'rgba(249, 168, 37, 0.87)',
      background: 'rgba(249, 168, 37, 0.08)',
    },
  ];

  const { data, isLoading } = useQuery(
    'get/cois',
    async () => axios({
      url: `api/coi/?workspace=${currentWorkspace.id}`,
      method: 'get',
    }),
    {
      enabled: currentWorkspace.id !== 0,
      select: (res: AxiosResponse<Iresponse>) => res.data.result,
    },
  );
  const handleSearch: (e: KeyboardEvent<HTMLImageElement>) => void = (e: KeyboardEvent<HTMLImageElement>) => {
    if (e.key === 'Enter') {
      setSearch(inputText);
    }
  };

  useEffect(() => {
    if (data !== undefined && data.length > 0) {
      const filtered = data.filter((element) => element.insured.toLowerCase().trim().includes(inputText.toLowerCase().trim()));
      setFilteredData(filtered);
    } else {
      setFilteredData([]);
    }
  }, [inputText, data]);

  const handleEdit: () => void = () => {
    setopenEditModal(true);
  };

  const closeEditModal: () => void = () => {
    setopenEditModal(false);
  };

  const { data: users = [] } = useQuery(
    ['get/buildings'],
    async () => axios({
      url: `api/filter/property/?workspace=${currentWorkspace.id}`,
      method: 'get',
    }),
    {
      select: (res: AxiosResponse<BuildingsResponse>) => {
        const options = res.data.detail.map((user: { address: string; id: number }) => ({
          label: user.address,
          value: user.id,
        }));

        return options;
      },
    },
  );

  const columns = useMemo(
    () => [
      {
        Header: 'Vendor',
        accessor: 'insured',
        width: '16%',
        Cell: (cell: Cell<IDataObject>): JSX.Element => {
          const { value } = cell;
          const { row } = cell;
          const { original } = row;

          return (
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events
            <div onClick={(): void => {
              navigate(
                '/workspace/cois/view-coi',
                { state: original.file },
              );
            }}
            >
              {value || <p style={{ opacity: '0' }}>-</p>}
            </div>
          );
        },
      },
      {
        Header: 'Property',
        accessor: 'property',
        width: '16%',

        Cell: (cell: Cell<IDataObject>): JSX.Element => {
          const { row } = cell;
          const { original } = row;
          return (
            <div className='cois-table-dropdown'>
              <PropertySelect
                id={original.id}
                propertyList={users}
                defaultValue={original.property !== null ? original.property.id : ''}
              />
            </div>
          );
        },

      },
      {
        Header: 'Category',
        accessor: 'vendor_category',
        width: '16%',

        Cell: (cell: Cell<IDataObject>): JSX.Element => {
          const { row } = cell;
          const { original } = row;

          const filteredVendors = (): IvendorFilter[] => {
            if (original.property === null) return [];
            // eslint-disable-next-line array-callback-return
            const filter = getVendorsList.filter((item) => {
              if (item.buildings.length === 0 || item.buildings.includes(original.property.id)) {
                return item;
              }
            });
            return filter;
          };
          return (
            <div className='cois-table-dropdown'>
              <VendorSelect
                id={original.id}
                vendorList={filteredVendors().length === 0 ? getVendorsList : filteredVendors()}
                defaultValue={original.vendor_category}
              />
            </div>
          );
        },

      },
      {
        Header: 'G/L Account',
        accessor: 'gl_accounts',
        width: '16%',
      },
      {
        Header: 'Expires',
        accessor: 'general_liability_exp_date',
        width: '16%',

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
        Header: 'Status',
        accessor: 'status',
        width: '16%',
        Cell: (cell: Cell<IDataObject>): JSX.Element => {
          const { value } = cell;
          const statusColor = colors.filter((item) => item.status === value);
          const isValid = statusColor.length > 0 && statusColor;
          return (

            <div
              className='status-values-cois d-flex justify-content-center'
              style={{
                color: isValid ? statusColor[0].color : '#2f2f2f',
                background: isValid ? statusColor[0].background : '#fffff',
              }}
            >
              {value}
            </div>

          );
        },
      },
      {
        Header: '',
        accessor: 'popper',
        width: '3%',
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
                      <MoreVertIcon />
                    </IconButton>
                    <Popper {...bindPopper(popupState)} transition>
                      {({ TransitionProps }): JSX.Element => (
                        <ClickAwayListener
                          onClickAway={(): void => {
                            popupState.close();
                          }}
                        >
                          <Fade {...TransitionProps} timeout={350}>
                            <Paper className='cois-popover'>
                              <div
                                className='chart-btn'
                                onClick={(): void => {
                                  handleEdit();
                                  setEditData(original);
                                  popupState.close();
                                }}
                                aria-hidden='true'
                              >
                                <i className='fas fa-pen edit-icon fa-lg edit-icons' />
                                <span className='edit-text'> Edit</span>
                              </div>
                              <div
                                className='chart-btn'
                                onClick={(): void => {
                                  setviewProperties(original);
                                  setEditData(original);
                                  setshowSidesheet(true);
                                  popupState.close();
                                }}
                                aria-hidden='true'
                              >
                                <VisibilityIcon className='edit-icons' />
                                <span className='view-properties'>
                                  View Properties
                                </span>
                              </div>
                              <div
                                className='chart-btn'
                                onClick={(): void => {
                                  deleteCOI(original.id);
                                  popupState.close();
                                }}
                                aria-hidden='true'
                              >
                                <DeleteIcon className='edit-icons' />
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
    [currentBuilding, getVendorsList, users],
  );

  return (
    <>
      {(data && data.length > 0) || isLoading ? (
        <>
          <div className='cois-wrapper' style={{ marginRight: showSidesheet ? '323px' : '39px' }}>
            <StradaLoader open={isLoading} />
            <div className='header'>
              <Typography className='header-text'>COIs</Typography>
              <div className='d-flex'>
                <Grid item sm={6} className='search-field'>
                  <Paper elevation={0} className='search-paper'>
                    <InputBase
                      value={inputText}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>): void => { setInputText(e.target.value); }}
                      onBlur={(): void => { setSearch(inputText); }}
                      onKeyPress={handleSearch}
                      placeholder='Search'
                      endAdornment={(
                        <IconButton style={{ padding: 0 }} onClick={(): void => { setSearch(inputText); }}>
                          <SearchIcon className='search-icon' />
                          {' '}
                        </IconButton>
                      )}
                    />

                    {' '}
                  </Paper>
                </Grid>
                <div className='button-wrapper '>
                  <PrimayButton
                    onClick={(): void => {
                      navigate('/workspace/cois/new');
                    }}
                  >
                    Add New COI
                  </PrimayButton>
                </div>
              </div>
            </div>

            <div>
              <COIsErrorBar />
              <CustomTable
                {...{
                  columns,
                  data: filteredData !== undefined ? filteredData : [],
                }}
              />
            </div>
          </div>
          {showSidesheet && (
            <div className='coi-details-sidesheet'>
              <DetailSideSheet
                statusColors={colors}
                openEditModal={(): void => {
                  setopenEditModal(true);
                  setshowSidesheet(false);
                }}
                viewProperties={viewProperties}
                showSidesheet={(): void => { setshowSidesheet(false); }}
              />
            </div>
          )}
          <EditCOI handleClose={closeEditModal} open={openEditModal} editData={editData} />
        </>
      )
        : (
          <div className='empty-array-wrapper'>
            <p className='header'>No COIs</p>
            <p className='text'>You haven’t placed any COI.</p>
            <div className='button-wrapper'>
              <PrimayButton
                onClick={(): void => {
                  navigate('/workspace/cois/new');
                }}
              >
                Add New COI
              </PrimayButton>
            </div>
          </div>
        )}
    </>
  );
}
