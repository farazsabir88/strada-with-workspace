/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import {
  Checkbox,
  Table, TableBody, TableCell, TableHead, TableRow, TableSortLabel, Grid, Typography, IconButton,
} from '@mui/material';
import StradaSearch from 'admin/buildingSection/budget-calendar/components/StradaSearch';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import DeleteIcon from '@mui/icons-material/Delete';

import moment from 'moment';
import type { SelectChangeEvent } from '@mui/material/Select';
import { useNavigate } from 'react-router-dom';
import { makeStyles } from '@mui/styles';
import { useSnackbar } from 'notistack';
import { useSelector } from 'react-redux';
import type { RootState } from 'mainStore';
import { StyledTab, StyledTabs } from 'shared-components/components/StyledComponent';
import SelectInput from 'shared-components/inputs/SelectInput';
import StradaLoader from 'shared-components/components/StradaLoader';
import type { IVendorListing, IStatus, IApprovalDetails } from 'admin/purchaseOrder/types';
import BuildingFilter from 'admin/buildingSection/budget-calendar/components/BuildingFilter';
import Popper from '@mui/material/Popper';
import PopupState, { bindToggle, bindPopper } from 'material-ui-popup-state';
import Fade from '@mui/material/Fade';
import Paper from '@mui/material/Paper';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';

const useStyles = makeStyles({
  select_design: {
    '&. MuiSelect-select': {
      marginTop: '2px',
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderStyle: 'none',
    },
  },
  cell_design: {
    color: 'red !important',
    '& .MuiTableCell-root': {
      padding: '0px',
      '& .MuiFormControl-fullWidth': {
        margin: '0px !important',
      },
    },
  },
});

function PurchaseOrderContent(): JSX.Element {
  const queryClient = useQueryClient();
  const classes = useStyles();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [tabIndex, setTabIndex] = useState(0);
  const [selectedCount, setSelectedCount] = useState(0);
  const [sortOrder, setSortOrder] = useState('desc');
  const [sortBy, setSortBy] = useState('vendor');
  const [POData, setPOData] = useState<IVendorListing[]>();
  const [filteredPOData, setFilteredPOData] = useState<IVendorListing[]>();
  const [selectedPOData, setSelectedPOData] = useState<IVendorListing[]>();
  const [buildingFilter, setBuildingFilter] = useState<number[]>([]);
  const [search, setSearch] = useState('');

  const currentWorkspace = useSelector((state: RootState) => state.workspaces.currentWorkspace.currentWorkspace);

  const StatusList = [
    { value: 0, name: 'Open' },
    { value: 1, name: 'Closed' },
  ];
  const { isLoading } = useQuery(
    ['get-PO-list', buildingFilter, search],
    async () => axios({
      url: `api/purchase-orders/?workspace=${currentWorkspace.id}`,
      method: 'GET',
      params: {
        search,
        property: buildingFilter,
      },
    }),
    {
      onSuccess: (res) => {
        if (res.data !== undefined) {
          const data: IVendorListing[] = res.data.result;
          setPOData(data);
          setFilteredPOData(data);
        }
      },
    },
  );
  const { mutate: updateStatus, isLoading: updating } = useMutation(async ({ closed, id }: { closed: boolean; id: number | undefined }) => axios({
    url: `api/purchase-orders/${id}/`,
    method: 'PATCH',
    data: { closed },
  }), {
    onSuccess: async () => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      await queryClient.invalidateQueries('get-PO-list').catch()
        .then();
    },

  });

  const { mutate: deletePO, isLoading: deleting } = useMutation(async (id: number) => axios({
    url: `api/purchase-orders/${id}/`,
    method: 'DELETE',
  }), {
    onSuccess: async () => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      await queryClient.invalidateQueries('get-PO-list').catch()
        .then();
      enqueueSnackbar('Deleted Successfully');
    },
  });

  const { mutate: sendPOApproval, isLoading: sending } = useMutation(async (data: IApprovalDetails[]) => axios({
    url: 'api/purchase-orders/send_po_email/',
    method: 'POST',
    data: { data },
  }), {
    onSuccess: async () => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      await queryClient.invalidateQueries('get-PO-list').catch()
        .then();
      enqueueSnackbar('PO sent for approval.');
    },
  });

  const getSelectedCount = (): void => {
    let count = 0;
    const newData: IVendorListing[] = [];
    if (filteredPOData !== undefined && filteredPOData.length > 0) {
      filteredPOData.forEach((item) => {
        if (item.selected) {
          count += 1;
          newData.push(item);
        }
      });
    }
    setSelectedPOData(newData);
    setSelectedCount(count);
  };

  const handleTabChange = (event: React.SyntheticEvent, index: number): void => {
    if (event.type === 'click') {
      setTabIndex(index);
      const filterPOData: IVendorListing[] = [];
      if (index === 0) {
        POData?.forEach((purchase) => {
          purchase.selected = false;
          filterPOData.push(purchase);
        });
      } else if (index === 1) {
        POData?.forEach((purchase) => {
          purchase.selected = false;
          if (purchase.status === 2) {
            filterPOData.push(purchase);
          }
        });
      } else if (index === 2) {
        POData?.forEach((purchase) => {
          purchase.selected = false;
          if (purchase.status === 1) {
            filterPOData.push(purchase);
          }
        });
      } else if (index === 3) {
        POData?.forEach((purchase) => {
          purchase.selected = false;
          if (purchase.status === 0) {
            filterPOData.push(purchase);
          }
        });
      } else if (index === 4) {
        POData?.forEach((purchase) => {
          purchase.selected = false;
          if (purchase.status === 3) {
            filterPOData.push(purchase);
          }
        });
      }
      setFilteredPOData(filterPOData);
      getSelectedCount();
    }
  };

  const getStatusValue = (value: number | undefined): JSX.Element => {
    if (value === 0) {
      return <div className='f-badge not-approved'>Not Approved</div>;
    } if (value === 1) {
      return <div className='f-badge waiting'>Waiting for Approval</div>;
    } if (value === 2) {
      return <div className='f-badge approved'>Approved</div>;
    } if (value === 3) {
      return <div className='f-badge rejected'>Rejected</div>;
    }
    return <div />;
  };

  const handleSelect = (type: string, event: React.ChangeEvent<HTMLInputElement>, index: number): void => {
    if (filteredPOData !== undefined && filteredPOData.length > 0) {
      if (type === 'single') {
        const filteredPODataClone = [...filteredPOData];
        filteredPODataClone[index].selected = event.target.checked;
        setFilteredPOData(filteredPODataClone);
      } else if (type === 'all') {
        const filteredPODataCloneTwo = [...filteredPOData];
        const updatedFilterdData = filteredPODataCloneTwo.map((item: IVendorListing) => {
          item.selected = event.target.checked;
          return item;
        });
        setFilteredPOData(updatedFilterdData);
      }
    }
    getSelectedCount();
  };

  const sortData = (): void => {
    if (sortBy === 'vendor') {
      filteredPOData?.sort(
        (a, b) => {
          if (a.vendor !== null && b.vendor !== null && a.vendor.label.toUpperCase().trim() > b.vendor.label.toUpperCase().trim()) {
            return sortOrder === 'desc' ? 1 : -1;
          }
          if (a.vendor !== null && b.vendor !== null && a.vendor.label.toUpperCase().trim() === b.vendor.label.toUpperCase().trim()) {
            return 0;
          }
          return sortOrder === 'desc' ? -1 : 1;
        },
      );
      setFilteredPOData(filteredPOData);
    } else if (sortBy === 'date') {
      filteredPOData?.sort(
        (a, b) => {
          const d1 = new Date(a.created_at);
          const d2 = new Date(b.created_at);
          if (d1.getTime() > d2.getTime()) {
            return sortOrder === 'desc' ? 1 : -1;
          }
          if (d1.getTime() === d2.getTime()) {
            return 0;
          }
          return sortOrder === 'desc' ? -1 : 1;
        },
      );
      setFilteredPOData(filteredPOData);
    } else if (sortBy === 'status') {
      filteredPOData?.sort(
        (a, b) => {
          if (a.closed.toString() > b.closed.toString()) { return sortOrder === 'desc' ? 1 : -1; }
          if (a.closed.toString() === b.closed.toString()) { return 0; }
          return sortOrder === 'desc' ? -1 : 1;
        },
      );
      setFilteredPOData(filteredPOData);
    } else if (sortBy === 'amount') {
      filteredPOData?.sort(
        (a, b) => {
          if (parseFloat(a.total) > parseFloat(b.total)) return sortOrder === 'desc' ? 1 : -1;
          if (parseFloat(a.total) === parseFloat(b.total)) {
            return 0;
          } return sortOrder === 'desc' ? -1 : 1;
        },
      );
      setFilteredPOData(filteredPOData);
    } else if (sortBy === 'approval') {
      filteredPOData?.sort(
        (a, b) => {
          if (a.status > b.status) return sortOrder === 'desc' ? 1 : -1;
          if (a.status === b.status) {
            return 0;
          } return sortOrder === 'desc' ? -1 : 1;
        },
      );
      setFilteredPOData(filteredPOData);
    } else {
      setFilteredPOData(filteredPOData);
    }
  };

  const handleSort = (val: string): void => {
    if (sortBy === val) {
      if (sortOrder === 'asc') {
        setSortOrder('desc');
      } else {
        setSortOrder('asc');
      }
    } else {
      setSortBy(val);
      setSortOrder('asc');
    }
    sortData();
  };

  const handleRowClick = (index: number): void => {
    if (filteredPOData !== undefined) {
      navigate(`/workspace/purchase-orders/${filteredPOData[index].id}`);
    }
  };

  const handleStatusChange = (event: SelectChangeEvent, index: number): void => {
    let status = false;
    if (Number(event.target.value) === 1) {
      status = true;
    }
    updateStatus({ closed: status, id: POData?.[index].id });
  };

  const getStatus = (closed: boolean): IStatus => {
    if (closed) return { value: '1', name: 'Closed' };
    return { value: '0', name: 'Open' };
  };

  const handleDelete = (): void => {
    if (selectedPOData !== undefined && selectedPOData.length > 0) {
      selectedPOData.forEach((item) => {
        if (item.selected) {
          deletePO(item.id);
        }
      });
    }
  };

  const handleSendApproval = (): void => {
    if (selectedPOData !== undefined && selectedPOData.length > 0) {
      const dataForApproval: IApprovalDetails[] = [];
      selectedPOData.forEach((item) => {
        if (item.selected) {
          const data = { id: item.id, managerApproval: item.manager_approval };
          dataForApproval.push(data);
          item.selected = false;
        }
      });
      sendPOApproval(dataForApproval);
      setTabIndex(0);
      getSelectedCount();
    }
  };
  const editPurchaseOrder = (editData: IVendorListing): void => {
    navigate(
      '/workspace/edit-purchase-order/',
      { state: editData },
    );
  };
  const handleSendApprovalPopper = (dataForApproval: IApprovalDetails[]): void => {
    sendPOApproval(dataForApproval);
  };

  const getStatusString = (value: number | undefined): string | undefined => {
    if (value === 0) {
      return undefined;
    } if (value === 1) {
      return 'approved';
    } if (value === 2) {
      return 'waiting for approval';
    } if (value === 3) {
      return 'not approved';
    }
    if (value === 4) {
      return 'rejected';
    }
    return undefined;
  };

  return (
    <div
      style={{
        display: 'flex', width: '100%', margin: '42px 1.5rem 1.5rem 1.5rem',
      }}
      className='Main-purchase-orders'
    >
      <StradaLoader open={isLoading || updating || deleting || sending} />
      <div className='purchases'>
        <Grid container mt={2} spacing={3} className='search-field-wrapper'>
          <Grid item sm={6}>
            <Typography style={{
              fontSize: '24px', fontWeight: '550', fontFamily: 'roboto-medium', color: 'rgba(33, 33, 33, 0.87)',
            }}
            >
              Purchase Order
            </Typography>
          </Grid>
          <Grid item sm={6} className='search-field d-flex justify-content-end'>
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

        <div className='mt-4 mb-4 border mainarea-PO'>
          <StyledTabs value={tabIndex} onChange={handleTabChange}>
            <StyledTab label='All' />
            <StyledTab label='Approved' />
            <StyledTab label='Waiting for Approval' />
            <StyledTab label='Not Approved' />
            <StyledTab label='Rejected' />
          </StyledTabs>
          <Table aria-label='simple table'>
            <TableHead>
              {selectedCount === 0 ? (
                <TableRow>
                  <TableCell align='center' style={{ width: '6%' }}>
                    <Checkbox
                      id='selectAll'
                      name='selectAll'
                      checked={filteredPOData && filteredPOData.length > 0 && selectedCount === filteredPOData.length}
                      onChange={(e): void => { handleSelect('all', e, -1); }}
                    />
                  </TableCell>
                  <TableCell align='left' style={{ fontFamily: 'Roboto-Medium', width: '20%' }}>
                    <TableSortLabel
                      active={sortBy === 'vendor'}
                      direction={sortOrder === 'asc' ? 'asc' : 'desc'}
                      onClick={(): void => { handleSort('vendor'); }}
                    >
                      Vendor
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align='left' style={{ fontFamily: 'Roboto-Medium', width: '20%' }}>
                    <TableSortLabel
                      active={sortBy === 'date'}
                      direction={sortOrder === 'asc' ? 'asc' : 'desc'}
                      onClick={(): void => { handleSort('date'); }}
                    >
                      Property
                      {' '}

                    </TableSortLabel>
                  </TableCell>
                  <TableCell align='left' style={{ fontFamily: 'Roboto-Medium', width: '20%' }}>
                    <TableSortLabel
                      active={sortBy === 'date'}
                      direction={sortOrder === 'asc' ? 'asc' : 'desc'}
                      onClick={(): void => { handleSort('date'); }}
                    >
                      Date Processed
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align='left' style={{ fontFamily: 'Roboto-Medium', width: '10%' }}>
                    <TableSortLabel
                      active={sortBy === 'status'}
                      direction={sortOrder === 'asc' ? 'asc' : 'desc'}
                      onClick={(): void => { handleSort('status'); }}
                    >
                      Status
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align='right' style={{ fontFamily: 'Roboto-Medium', width: '8%', paddingRight: '0px' }}>
                    <TableSortLabel
                      active={sortBy === 'amount'}
                      direction={sortOrder === 'asc' ? 'asc' : 'desc'}
                      onClick={(): void => { handleSort('amount'); }}
                    >
                      $Amount
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align='right' style={{ fontFamily: 'Roboto-Medium', width: '30%' }}>
                    <TableSortLabel
                      active={sortBy === 'approval'}
                      direction={sortOrder === 'asc' ? 'asc' : 'desc'}
                      onClick={(): void => { handleSort('approval'); }}
                    >
                      Approval
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align='right' style={{ fontFamily: 'Roboto-Medium', width: '12%' }} />
                </TableRow>
              )
                : (
                  <TableRow>
                    <TableCell align='center' style={{ fontFamily: 'Roboto-Medium', width: '6%' }}>
                      <Checkbox
                        id='selectAll'
                        checked={filteredPOData && filteredPOData.length > 0 && selectedCount === filteredPOData.length}
                        name='selectAll'
                        onChange={(e): void => { handleSelect('all', e, -1); }}
                      />
                    </TableCell>
                    <TableCell align='left' style={{ fontFamily: 'Roboto-Medium', width: '12%' }}>
                      <div>
                        {selectedCount}
                        {' '}
                        Selected
                      </div>
                    </TableCell>
                    <TableCell align='left' style={{ fontFamily: 'Roboto-Medium', width: '20%' }}>
                      <div aria-hidden='true' onClick={handleSendApproval} className='cursor-pointer'>
                        <i className='fas fa-envelope me-1' style={{ color: '#00CFA1' }} />
                        Send For Approval
                      </div>
                    </TableCell>
                    <TableCell align='left' style={{ fontFamily: 'Roboto-Medium', width: '10%' }}>
                      <div aria-hidden='true' onClick={handleDelete} className='cursor-pointer'>
                        <i className='far fa-trash-alt me-1' style={{ color: '#00CFA1' }} />
                        Delete
                      </div>
                    </TableCell>
                    <TableCell align='left' style={{ width: '20%' }} />
                    <TableCell align='left' style={{ width: '20%' }} />
                    <TableCell align='left' style={{ width: '20%' }} />
                  </TableRow>
                )}
            </TableHead>
            {filteredPOData && filteredPOData.length > 0 && (
              <TableBody>
                {filteredPOData.map((item, index) => (
                  <TableRow key={item.id} hover className={classes.cell_design} style={{ backgroundColor: item.selected ? 'rgba(0, 207, 161, 0.08)' : '' }}>
                    <TableCell align='center'>
                      <div className='checkbox-cois'>
                        <Checkbox
                          id='single'
                          name='single'
                          checked={Boolean(item.selected)}
                          onChange={(e): void => { handleSelect('single', e, index); }}
                        />
                      </div>
                    </TableCell>

                    <TableCell align='left' onClick={(): void => { handleRowClick(index); }}>{item.vendor !== null ? item.vendor.label : '' }</TableCell>
                    <TableCell align='left' onClick={(): void => { handleRowClick(index); }}>{item.property.address !== null ? item.property.address : '' }</TableCell>

                    <TableCell align='left' onClick={(): void => { handleRowClick(index); }}>{moment(item.created_at).format('MM/DD/YYYY hh:mm: A')}</TableCell>
                    <TableCell align='left'>
                      {!item.status_disable_check
                        ? (
                          <SelectInput
                            value={getStatus(item.closed).value}
                            name='status'
                            label=''
                            onChange={(obj): void => { handleStatusChange(obj, index); }}
                            options={StatusList}
                            className={classes.select_design}
                            showPleaseSelect={false}
                          />

                        )
                        : <p style={{ padding: '0 12px' }}>Open</p>}
                    </TableCell>
                    <TableCell align='right' onClick={(): void => { handleRowClick(index); }}>
                      $
                      {item.total}
                    </TableCell>
                    <TableCell align='right' onClick={(): void => { handleRowClick(index); }}>{ getStatusValue(item.status)}</TableCell>
                    <TableCell align='right'>
                      <div>
                        <PopupState variant='popper' popupId='demo-popup-popper'>
                          {(popupState): JSX.Element => (
                            <div className='popper-wrapper-po'>
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
                                      <Paper className='purchase-order-popover' elevation={4}>
                                        <div
                                          className='icon-btn'
                                          onClick={(): void => {
                                            editPurchaseOrder(item);
                                            popupState.close();
                                          }}
                                          aria-hidden='true'
                                        >
                                          <i className='fas fa-pen edit-icon fa-lg edit-icons' />
                                          <span className='edit-text'> Edit</span>
                                        </div>
                                        <div
                                          className='icon-btn'
                                          onClick={(): void => {
                                            handleSendApprovalPopper([{ id: item.id, managerApproval: item.manager_approval }]);
                                            popupState.close();
                                          }}
                                          aria-hidden='true'
                                        >
                                          <AssignmentIndIcon className='edit-icon' />
                                          <span className='view-properties'>
                                            Send for Approval
                                            {' '}

                                          </span>
                                        </div>
                                        <div
                                          className='icon-btn'
                                          onClick={(): void => {
                                            deletePO(item.id);
                                            popupState.close();
                                          }}
                                          aria-hidden='true'
                                        >
                                          <DeleteIcon className='edit-icon' />
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

                    </TableCell>

                    <TableCell align='left' style={{ width: '4%' }} />
                  </TableRow>
                ))}
              </TableBody>
            ) }

          </Table>
          {
            filteredPOData && filteredPOData.length === 0 && (
              <p className='empty-filtered-array'>
                There are no
                {' '}
                {getStatusString(tabIndex)}
                {' '}
                purchase orders
              </p>
            )
          }
        </div>
      </div>
    </div>
  );
}

export default PurchaseOrderContent;
