/* eslint-disable no-nested-ternary */
/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-named-as-default */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */

import React, {
  useMemo, useState, useEffect, useRef,
} from 'react';
import {
  Avatar, IconButton, Divider, Typography, Button,
} from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { useQuery, useQueryClient, useMutation } from 'react-query';
import type { AxiosResponse } from 'axios';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Popper from '@mui/material/Popper';
import PopupState, { bindToggle, bindPopper } from 'material-ui-popup-state';
import Fade from '@mui/material/Fade';
import Paper from '@mui/material/Paper';
import { useSnackbar } from 'notistack';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import type { Cell } from 'react-table';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ShareIcon from '@mui/icons-material/Share';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import ArchiveIcon from '@mui/icons-material/Archive';
import PrintIcon from '@mui/icons-material/Print';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import CloseIcon from '@mui/icons-material/Close';
import CustomLoader from 'shared-components/components/CustomLoader';
import CustomTable from 'shared-components/tables/CustomTable';
import PrimayButton from 'shared-components/components/PrimayButton';
import type { RootState } from 'mainStore';
import type { IDataObject } from 'formsTypes';
import LinearProgress from '@mui/material/LinearProgress';
import { withStyles } from '@mui/styles';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import InputField from 'shared-components/inputs/InputField';
import AvatarGroup from '@mui/material/AvatarGroup';
import SelectInput from 'shared-components/inputs/SelectInput';
import type { SelectChangeEvent } from '@mui/material/Select';
import StradaSearch from 'admin/buildingSection/budget-calendar/components/StradaSearch';
import Filters from './Filters';
import ChecklistCard from './ChecklistCard';
import SortingDrawer from './SortingDrawer';
import FilterDrawer from './FilterDrawer';
import type {
  Iresponse, Iassignee, IDuplicateChecklist, ITemplateFilterResponse, IBuildingFilterResponse, IAssigneeFilterResponse, ISortBy, IBuilding,
} from './types';

const BorderLinearProgress = withStyles(() => ({
  root: {
    height: 3,
    borderRadius: 5,
  },
  colorPrimary: {
    backgroundColor: '#eeeeee',
  },
  bar: {
    borderRadius: 5,
    backgroundColor: '#2196F3',
  },
}))(LinearProgress);

const statusList = [
  {
    name: 'Not Started',
    value: 1,
    color: 'rgba(33, 33, 33, 0.6)',
    background: 'rgba(0, 0, 0, 0.08)',
  },
  {
    name: 'In Process',
    value: 2,
    color: 'rgba(33, 150, 243, 0.87)',
    background: 'rgba(33, 150, 243, 0.08)',
  },
  {
    name: 'Completed',
    value: 3,
    selected: false,
    label: 'Completed',
    color: '#4CAF50',
    background: 'rgba(76, 175, 80, 0.08)',
  },
  {
    name: 'Archive',
    value: 4,
    color: 'rgba(249, 168, 37, 0.87)',
    background: 'rgba(249, 168, 37, 0.08)',
  },
];

export default function ChecklistListing(): JSX.Element {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const [data, setData] = useState<Iresponse[]>();
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<number[]>([]);
  const [buildingFilter, setBuildingFilter] = useState<number[]>([]);
  const [templateFilter, setTemplateFilter] = useState<number[]>([]);
  const [assignees, setAssignees] = useState<number[]>([]);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [taskCompletedType, setTaskCompletedType] = useState<string>('');
  const [taskCompletedValue, setTaskCompletedValue] = useState<number | undefined>();
  const [open, setOpen] = useState<boolean>(false);
  const [startLoader, setStartLoader] = useState<boolean>(false);
  const [checklistName, setChecklistName] = useState<string>('');
  const [selectedTemplate, setSelectedTemplate] = useState<number>(-1);
  const [selectedBuilding, setSelectedBuilding] = useState<number>(-1);
  const [focusedChecklistId, setFocusedChecklistId] = useState<number | string>('');
  const [openDeleteChecklistDialog, setOpenDeleteChecklistDialog] = useState<boolean>(false);
  const [openSortDrawer, setOpenSortDrawer] = useState<boolean>(false);
  const [ascendingSort, setAscendingSort] = useState<boolean>(true);
  const [sortBy, setSortBy] = useState<ISortBy>({ value: 'last_activity', label: 'Last Activity' });
  const [openFilterDrawer, setOpenFilterDrawer] = useState<boolean>(false);

  const childRef = useRef(null);
  const currentBuilding = useSelector(
    (state: RootState) => state.workspaces.currentBuilding,
  );
  const currentWorkspace = useSelector((state: RootState) => state.workspaces.currentWorkspace.currentWorkspace);

  const { data: templateList = [] } = useQuery('get/checklist-template', async () => axios({
    url: `/api/filter/checklist-template/?workspace=${currentWorkspace.id}`,
    method: 'GET',
  }), {
    select: (res: AxiosResponse<ITemplateFilterResponse>) => {
      let options = res.data.detail.map((user) => ({
        name: user.template_name,
        value: user.id,
      }));
      if (options.length === 0) {
        options = [{ name: 'No Template', value: -1 }];
      }

      return options;
    },
  });
  const { data: buildingList = [] } = useQuery('get/property', async () => axios({
    url: `/api/filter/property/?workspace=${currentWorkspace.id}`,
    method: 'GET',
  }), {
    select: (res: AxiosResponse<IBuildingFilterResponse>) => {
      let options = res.data.detail.map((user) => ({
        name: user.address,
        value: user.id,
      }));

      if (options.length === 0) {
        options = [{ name: 'No Building', value: -1 }];
      }

      return options;
    },
  });
  const { data: assigneeList = [] } = useQuery('get/people', async () => axios({
    url: `/api/filter/assignee/?workspace=${currentWorkspace.id}`,
    method: 'get',

  }), {
    select: (res: AxiosResponse<IAssigneeFilterResponse>) => {
      const options = res.data.detail.map((user) => ({
        name: user.name,
        value: user.id,
        avatar: user.avatar,
      }));

      return options;
    },
  });

  const { isLoading } = useQuery(
    ['get/checklist', search, statusFilter, templateFilter, buildingFilter, assignees, startDate, endDate, taskCompletedType, taskCompletedValue],
    async () => axios({
      url: `/api/checklist/?workspace=${currentWorkspace.id}`,
      method: 'get',
      params: {
        search,
        status: statusFilter,
        template: templateFilter,
        property: buildingFilter,
        assignee: assignees,
        start_date: startDate !== undefined ? moment(startDate).format('MMMM DD,YYYY') : null,
        end_date: endDate !== undefined ? moment(endDate).format('MMMM DD,YYYY') : null,
        task_completed_type: taskCompletedType !== '' ? taskCompletedType : null,
        task_completed_value: taskCompletedValue !== undefined ? taskCompletedValue : null,
      },
    }),
    {
      enabled: currentWorkspace.id !== 0,
      select: (res: AxiosResponse<Iresponse[]>) => res.data,
      onSuccess: (res) => {
        setData(res);
        setStartLoader(false);
      },
    },
  );

  useEffect(() => {
    if (data !== undefined && data.length > 0) {
      if (ascendingSort) {
        if (sortBy.value === 'assignees') {
          const sortedData = [...data].sort((a, b) => (a[sortBy.value as keyof Iresponse] === null ? 1 : a[sortBy.value].length.toString().toLowerCase() > b[sortBy.value].length.toString().toLowerCase() ? -1 : 1));
          setData(sortedData);
        } else if (sortBy.value === 'building') {
          const sortedData = [...data].sort((a, b) => (a[sortBy.value as keyof Iresponse] === null ? 1 : a[sortBy.value].address.toString().toLowerCase() > b[sortBy.value].address.toString().toLowerCase() ? -1 : 1));
          setData(sortedData);
        } else {
          const sortedData = [...data].sort((a, b) => (a[sortBy.value as keyof Iresponse] === null ? 1 : a[sortBy.value].toString().toLowerCase() > b[sortBy.value].toString().toLowerCase() ? -1 : 1));
          setData(sortedData);
        }
      } else if (sortBy.value === 'assignees') {
        const sortedData = [...data].sort((a, b) => (a[sortBy.value as keyof Iresponse] === null ? -1 : a[sortBy.value].length.toString().toLowerCase() > b[sortBy.value].length.toString().toLowerCase() ? 1 : -1));
        setData(sortedData);
      } else if (sortBy.value === 'building') {
        const sortedData = [...data].sort((a, b) => (a[sortBy.value as keyof Iresponse] === null ? -1 : a[sortBy.value].address.toString().toLowerCase() > b[sortBy.value].address.toString().toLowerCase() ? 1 : -1));
        setData(sortedData);
      } else {
        const sortedData = [...data].sort((a, b) => (a[sortBy.value as keyof Iresponse] === null ? -1 : a[sortBy.value].toString().toLowerCase() > b[sortBy.value].toString().toLowerCase() ? 1 : -1));
        setData(sortedData);
      }
    }
  }, [sortBy, ascendingSort]);

  //   const onPrintChecklist=()=>{
  //     const { focusedIndex, checklistslist } = this.state;
  //     const data=checklistslist[focusedIndex];
  //     data['getPrint']=true
  //     this.props.history.push(`/checklists/view/${data.id}`,data)
  //     this.setState({
  //         checklistsMenuAnchorEl:null,
  //         focusedIndex: -1,
  //     })
  // }
  const RenderFilterButton = (): string => {
    let count = 0;
    if (statusFilter.length !== 0) {
      count += 1;
    }
    if (buildingFilter.length !== 0) {
      count += 1;
    }
    if (templateFilter.length !== 0) {
      count += 1;
    }
    if (assignees.length !== 0) {
      count += 1;
    }
    if (startDate !== undefined) {
      count += 1;
    }
    if (taskCompletedType !== '' && taskCompletedValue !== undefined) {
      count += 1;
    }
    if (count === 0) {
      return '';
    }

    return count.toString();
  };
  const { mutate: deleteChecklist, isLoading: deleteLoader } = useMutation(
    async (id: number | string) => axios({
      url: `/api/checklist/${id}`,
      method: 'DELETE',
    }),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries('get/checklist').then();
        enqueueSnackbar('Deleted Successfully');
      },
    },
  );

  const handleResetFilters = (): void => {
    setStartLoader(true);
    childRef.current.resetDrawerFilters();
    setSearch('');
    setTemplateFilter([]);
    setBuildingFilter([]);
    setStatusFilter([]);
    setAssignees([]);
    setStartDate(undefined);
    setEndDate(undefined);
    setTaskCompletedType('');
    setTaskCompletedValue(undefined);
  };
  const { mutate: onDuplicateChecklist } = useMutation(
    async (rowData: IDuplicateChecklist) => axios({
      url: '/api/checklist/',
      method: 'post',
      data: {
        building: currentBuilding.id,
        name: `${rowData.name} '(Copy)'`,
        template: rowData.template,
        workspace: currentWorkspace.id,
      },
    }),
    {
      onSuccess: (res) => {
        navigate(`/workspace/view-checklist/${res.data.id}`, { state: res.data });
        setOpen(false);
        setChecklistName('');
      },
    },
  );
  const { mutate: handleCreateChecklist } = useMutation(async () => axios({
    url: '/api/checklist/',
    method: 'post',
    data: {
      building: selectedBuilding,
      name: checklistName,
      template: selectedTemplate,
      workspace: currentWorkspace.id,
    },
  }), {
    onSuccess: (res) => {
      navigate(`/workspace/view-checklist/${res.data.id}`, { state: res.data });
      setOpen(false);
      setChecklistName('');
      setSelectedTemplate(-1);
      setSelectedBuilding(-1);
    },
  });
  const { mutate: archiveChecklist, isLoading: archiveLoader } = useMutation(
    async (id: number | string) => axios({
      url: '/api/checklist/archive_checklist/',
      data: { checklist: id },
      method: 'POST',
    }),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries('get/checklist').then();
        enqueueSnackbar('Archive Successfully');
      },
    },
  );
  const copyCodeToClipboard = (id: number | string): void => {
    const copyLink = `${process.env.REACT_APP_BASE_URL}building/view-checklist/${id}`;
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    navigator.clipboard.writeText(copyLink);
    enqueueSnackbar('Checklist Link Copied Successfully');
  };

  const columns = useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'name',
        width: '20%',
        Cell: (cell: Cell<IDataObject>): JSX.Element => {
          const { value, row } = cell;
          const { original } = row;
          const newVal: string = value;
          return (
            <div
              style={{ color: '#00CFA1' }}
              aria-hidden='true'
              onClick={(): void => {
                navigate(`/workspace/view-checklist/${original.id}`, { state: original });
              }}
            >
              {newVal}
            </div>
          );
        },
      },
      {
        Header: 'Property',
        accessor: 'building',
        width: '20%',
        Cell: (cell: Cell<IDataObject>): JSX.Element => {
          const { value } = cell;
          const newVal: IBuilding = value;
          return (
            <div>
              {newVal.address}
            </div>
          );
        },
      },
      {
        Header: 'Assignees',
        accessor: 'assignees',
        width: '10%',
        Cell: (cell: Cell<IDataObject>): JSX.Element => {
          const { value } = cell;
          const newVal: [] = value;
          return (
            <AvatarGroup max={3} className='flex-row-reverse' style={{ width: 'fit-content' }}>
              {newVal.map((assignee: Iassignee) => (
                <Avatar key={assignee.id} alt={assignee.name} src={`${process.env.REACT_APP_IMAGE_URL}${assignee.avatar}`} sx={{ height: '28px', width: '28px' }} />
              ))}
            </AvatarGroup>
          );
        },
      },
      {
        Header: 'Task Completed',
        accessor: 'task_completed',
        width: '15%',
        Cell: (cell: Cell<IDataObject>): JSX.Element => {
          const { value, row } = cell;
          const newVal: number = value;
          return (
            <div className='task-completed-div'>
              <div className={`progress-bar-div${(newVal === row.original.total_tasks) && newVal !== 0 ? '-completed' : ''}`}>
                <BorderLinearProgress variant='determinate' value={Math.floor((newVal / row.original.total_tasks) * 100)} />
              </div>
              <div style={{ marginLeft: '8px' }}>
                {`${newVal} / ${row.original.total_tasks}`}
              </div>
            </div>
          );
        },
      },
      {
        Header: 'Due',
        accessor: 'due_date',
        width: '15%',
        Cell: (cell: Cell<IDataObject>): JSX.Element => {
          const { value } = cell;
          const newVal: string = value;
          return (
            <div>
              {newVal && moment(newVal).format('LLL')}
            </div>
          );
        },
      },
      {
        Header: 'Last Activity',
        accessor: 'last_activity',
        width: '10%',
        Cell: (cell: Cell<IDataObject>): JSX.Element => {
          const { value } = cell;
          const newVal: number = value;
          return (
            <div>
              {newVal === 0 ? 'today' : `${newVal} days ago`}
            </div>
          );
        },
      },
      {
        Header: 'Status',
        accessor: 'status',
        width: '8%',
        Cell: (cell: Cell<IDataObject>): JSX.Element => {
          const { value } = cell;
          if (typeof value === 'number') {
            const currentStatus = statusList[value - 1];
            return (
              <div
                style={{
                  display: 'flex',
                  justifyItems: 'center',
                  alignItems: 'center',
                  marginLeft: '-8px',
                }}
              >
                <div
                  style={{
                    background: currentStatus.background,
                    color: currentStatus.color,
                  }}
                  className='single-tag-global'
                >
                  {' '}
                  {currentStatus.name}
                </div>
              </div>
            );
          }
          return <>-</>;
        },
      },
      {
        Header: '',
        accessor: 'account_new',
        width: '2%',
        Cell: (cell: Cell<IDataObject>): JSX.Element => {
          const { row } = cell;
          const { original } = row;
          //   const rowData: Iresponse = row.original;
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
                    <Popper {...bindPopper(popupState)} style={{ zIndex: '11' }} transition>
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
                                  navigate(`/workspace/view-checklist/${original.id}`, { state: original });
                                  popupState.close();
                                }}
                                aria-hidden='true'
                              >
                                <VisibilityIcon className='edit-delete-icon' />
                                <span className='edit-delete-text '> View</span>
                              </div>
                              <div
                                className='chart-btn'
                                onClick={(): void => {
                                  copyCodeToClipboard(original.id);
                                  popupState.close();
                                }}
                                aria-hidden='true'
                              >
                                <ShareIcon className='edit-delete-icon' />
                                <span className='edit-delete-text '> Share</span>
                              </div>
                              <div
                                className='chart-btn'
                                onClick={(): void => {
                                  const rowData = {
                                    name: original.name,
                                    template: original.template,
                                  };
                                  onDuplicateChecklist(rowData);
                                  popupState.close();
                                }}
                                aria-hidden='true'
                              >
                                <FileCopyIcon className='edit-delete-icon' />
                                <span className='edit-delete-text '> Duplicate</span>
                              </div>
                              <div
                                className='chart-btn'
                                onClick={(): void => {
                                  original.isPrint = true;
                                  navigate(`/workspace/view-checklist/${original.id}`, { state: original });
                                  popupState.close();
                                }}
                                aria-hidden='true'
                              >
                                <PrintIcon className='edit-delete-icon' />
                                <span className='edit-delete-text '> Print</span>
                              </div>
                              <div
                                className='chart-btn'
                                onClick={(): void => {
                                  archiveChecklist(original.id);
                                  popupState.close();
                                }}
                                aria-hidden='true'
                              >
                                <ArchiveIcon className='edit-delete-icon' />
                                <span className='edit-delete-text '> Archive</span>
                              </div>
                              <div
                                className='chart-btn'
                                onClick={(): void => {
                                  setOpenDeleteChecklistDialog(true);
                                  setFocusedChecklistId(original.id);
                                  popupState.close();
                                }}
                                aria-hidden='true'
                              >
                                <DeleteIcon className='edit-delete-icon' />
                                <span className='edit-delete-text '>
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
    [currentBuilding],
  );

  return (
    <>
      {data?.length === 0 && search === '' && statusFilter.length === 0 && buildingFilter.length === 0 && templateFilter.length === 0 && assignees.length === 0 && startDate === undefined && endDate === undefined && taskCompletedType === '' && taskCompletedValue === undefined
        ? (
          <div className='empty-array-wrapper-1'>
            {startLoader
              ? <CustomLoader />
              : (
                <>
                  <p>No checklists</p>
                  <div className='create-new-button'>
                    <PrimayButton
                      onClick={(): void => {
                        setOpen(true);
                      }}
                    >
                      Create new
                    </PrimayButton>
                  </div>
                </>
              ) }
          </div>
        )
        : (
          <div className='checklist-wrapper'>
            <div className='header'>
              <Typography className='header-text'>Checklists</Typography>
              <div className='right-side'>
                {window.innerWidth > 600
                && (
                  <div className='search-wrapper'>
                    <StradaSearch value={search} setSearch={setSearch} placeholder='Search' />
                  </div>
                )}
                <div className='button-wrapper'>
                  <PrimayButton
                    onClick={(): void => {
                      setOpen(true);
                    }}
                    style={{ fontSize: window.innerWidth < 600 ? '1.15rem' : '0.85rem' }}
                  >
                    Create new
                  </PrimayButton>
                </div>
              </div>
            </div>
            {window.innerWidth <= 600
              && (
                <>
                  <div className='search-wrapper mt-3 w-100'>
                    <StradaSearch value={search} setSearch={setSearch} placeholder='Search' />
                  </div>
                  <div className='d-flex justify-space-between align-items-canter mt-4 w-100'>
                    <div className={statusFilter.length === 0 && buildingFilter.length === 0 && templateFilter.length === 0 && assignees.length === 0 && startDate === undefined && endDate === undefined && taskCompletedType === '' && taskCompletedValue === undefined ? 'filter-div' : 'focused-filter-div'}>
                      <FilterAltIcon />
                      <p aria-hidden='true' onClick={(): void => { setOpenFilterDrawer(true); }}>{`Filter ${RenderFilterButton()}`}</p>
                    </div>
                    <div className='sorting-div'>
                      {ascendingSort ? <div><ArrowUpwardIcon /></div>
                        : <div><ArrowDownwardIcon /></div>}
                      <p aria-hidden='true' onClick={(): void => { setOpenSortDrawer(true); }}>{sortBy.label}</p>
                    </div>
                  </div>
                </>
              )}
            {window.innerWidth > 600
                && (
                  <div className='filters-wrapper'>
                    <Filters
                      statusFilter={statusFilter}
                      setStatusFilter={setStatusFilter}
                      buildingFilter={buildingFilter}
                      setBuildingFilter={setBuildingFilter}
                      templateFilter={templateFilter}
                      setTemplateFilter={setTemplateFilter}
                      assignees={assignees}
                      setAssignees={setAssignees}
                      taskCompletedType={taskCompletedType}
                      setTaskCompletedType={setTaskCompletedType}
                      taskCompletedValue={taskCompletedValue}
                      setTaskCompletedValue={setTaskCompletedValue}
                      startDate={startDate}
                      setStartDate={setStartDate}
                      endDate={endDate}
                      setEndDate={setEndDate}
                    />
                  </div>
                )}
            { data?.length !== 0
              ? (
                <div className='vendor-table-wrapper overflow-y-scroll'>
                  <Divider sx={{ mt: 3, mb: 0.9 }} />
                  {isLoading || deleteLoader || archiveLoader ? <div style={{ height: '60vh' }} className='vh-50 d-flex justify-content-center align-items-center'><CustomLoader /></div>
                    : window.innerWidth > 600
                      ? (
                        <CustomTable
                          {...{
                            columns,
                            data: data !== undefined ? data : [],
                          }}
                        />
                      )
                      // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
                      : <div>{ data !== undefined && data.map((item) => (<ChecklistCard item={item} copyCodeToClipboard={copyCodeToClipboard} onDuplicateChecklist={onDuplicateChecklist} archiveChecklist={archiveChecklist} setOpenDeleteChecklistDialog={setOpenDeleteChecklistDialog} setFocusedChecklistId={setFocusedChecklistId} />))}</div>}
                </div>
              )
              : (
                <div className='empty-array-wrapper-2'>
                  <p>No Checklist were found matching your search</p>
                  <div className='create-new-button'>
                    <PrimayButton
                      onClick={handleResetFilters}
                    >
                      Reset filters
                    </PrimayButton>
                  </div>
                </div>
              )}
          </div>
        )}
      <Dialog
        open={open}
        keepMounted
        fullWidth
      >
        <DialogContent style={{ width: '100%', marginBottom: '20px' }}>
          {window.innerWidth < 600
            ? (
              <div className='d-flex justify-content-between align-items-center'>
                <div
                  onClick={(): void => {
                    setOpen(false);
                    setChecklistName('');
                    setSelectedTemplate(-1);
                    setSelectedBuilding(-1);
                  }}
                  className='cursor-pointer'
                  aria-hidden='true'
                >
                  <CloseIcon />

                </div>
                <p className='create-template-title'>Create Checklist</p>
                <Button
                  variant='contained'
                  onClick={(): void => { handleCreateChecklist(); }}
                  style={{ textTransform: 'inherit', color: checklistName.replace(/^\s+|\s+$/g, '') !== '' && selectedTemplate !== -1 && selectedBuilding !== -1 ? 'white' : '#C6C6C6', background: checklistName.replace(/^\s+|\s+$/g, '') !== '' && selectedTemplate !== -1 && selectedBuilding !== -1 ? '#00CFA1' : '#EBEBE4' }}
                  disabled={checklistName.replace(/^\s+|\s+$/g, '') === '' || selectedTemplate === -1 || selectedBuilding === -1}
                  autoFocus
                >
                  Create
                </Button>
              </div>
            )
            : <p className='create-template-title'>Create Checklist</p>}
          <div className='create-template-div'>
            <InputField
              type='text'
              label='Name'
              name='name'
              value={checklistName}
              onChange={(event): void => { setChecklistName(event.target.value); }}
            />
          </div>
          <div style={{ marginTop: '5%' }}>
            <SelectInput
              value={selectedTemplate !== -1 ? JSON.stringify(selectedTemplate) : ''}
              name='template'
              label='Template'
              onChange={(obj: SelectChangeEvent): void => { setSelectedTemplate(Number(obj.target.value)); }}
              options={templateList}
              showPleaseSelect={false}
            />
          </div>
          <div style={{ marginTop: '5%' }}>
            <SelectInput
              value={selectedBuilding !== -1 ? JSON.stringify(selectedBuilding) : ''}
              name='building'
              label='Property'
              onChange={(obj: SelectChangeEvent): void => { setSelectedBuilding(Number(obj.target.value)); }}
              options={buildingList}
              showPleaseSelect={false}
            />
          </div>

        </DialogContent>
        {window.innerWidth > 600
        && (
          <DialogActions style={{ paddingRight: '20px' }}>
            <Button
              style={{ textTransform: 'inherit' }}
              onClick={(): void => {
                setOpen(false);
                setChecklistName('');
                setSelectedTemplate(-1);
                setSelectedBuilding(-1);
              }}
              color='primary'
            >
              Cancel
            </Button>
            <Button
              variant='contained'
              onClick={(): void => { handleCreateChecklist(); }}
              style={{ textTransform: 'inherit', color: checklistName.replace(/^\s+|\s+$/g, '') !== '' && selectedTemplate !== -1 && selectedBuilding !== -1 ? 'white' : '#C6C6C6', background: checklistName.replace(/^\s+|\s+$/g, '') !== '' && selectedTemplate !== -1 && selectedBuilding !== -1 ? '#00CFA1' : '#EBEBE4' }}
              disabled={checklistName.replace(/^\s+|\s+$/g, '') === '' || selectedTemplate === -1 || selectedBuilding === -1}
              autoFocus
            >
              Create
            </Button>
          </DialogActions>
        )}
      </Dialog>
      <Dialog
        open={openDeleteChecklistDialog}
        keepMounted
      >
        <DialogContent style={{ width: '100%', padding: '24px' }}>
          <div className='dialog-heading'>Delete this Checklist?</div>
          <span
            className='dialog-body'
            style={{
              fontSize: '14px', color: 'rgba(33, 33, 33, 0.6)', fontWeight: '400', marginTop: '15px',
            }}
          >
            Checklist will be deleted and irrecoverable!
          </span>
        </DialogContent>
        <DialogActions style={{ paddingRight: '20px' }}>
          <Button
            style={{ textTransform: 'inherit' }}
            onClick={(): void => {
              setOpenDeleteChecklistDialog(false);
            }}
            color='primary'
          >
            Cancel
          </Button>
          <Button variant='contained' onClick={(): void => { deleteChecklist(focusedChecklistId); setOpenDeleteChecklistDialog(false); }} style={{ textTransform: 'inherit', color: 'white', background: '#00CFA1' }} color='primary' autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <SortingDrawer openSortDrawer={openSortDrawer} setOpenSortDrawer={setOpenSortDrawer} ascendingSort={ascendingSort} setAscendingSort={setAscendingSort} sortBy={sortBy} setSortBy={setSortBy} />
      <FilterDrawer
        openFilterDrawer={openFilterDrawer}
        setOpenFilterDrawer={setOpenFilterDrawer}
        templates={templateList}
        buildings={buildingList}
        assignees={assigneeList}
        setStatusFilter={setStatusFilter}
        setBuildingFilter={setBuildingFilter}
        setTemplateFilter={setTemplateFilter}
        setAssignees={setAssignees}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        setTaskCompletedType={setTaskCompletedType}
        setTaskCompletedValue={setTaskCompletedValue}
        ref={childRef}
      />
    </>
  );
}
