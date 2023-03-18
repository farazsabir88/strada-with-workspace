/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-named-as-default */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */

import React, { useMemo, useState } from 'react';
import {
  Avatar, IconButton, Divider, Typography, Button,
} from '@mui/material';
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
import FileCopyIcon from '@mui/icons-material/FileCopy';
import CustomLoader from 'shared-components/components/CustomLoader';
import CustomTable from 'shared-components/tables/CustomTable';
import PrimayButton from 'shared-components/components/PrimayButton';
import type { RootState } from 'mainStore';
import type { IDataObject } from 'formsTypes';
// import { encrypt } from 'shared-components/hooks/useEncryption';
import StradaSearch from 'admin/buildingSection/budget-calendar/components/StradaSearch';
import AvatarGroup from '@mui/material/AvatarGroup';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import InputField from 'shared-components/inputs/InputField';
import Filters from './Filters';
import type {
  Iresponse, Iassignee, IErrorResponse,
} from './types';

export default function ChecklistList(): JSX.Element {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [search, setSearch] = useState<string>('');
  const [assignees, setAssignees] = useState<number[]>([]);
  const [author, setAuthor] = useState<number[]>([]);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [open, setOpen] = useState<boolean>(false);
  const [isDuplicate, setIsDuplicate] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<number | string>();
  const [templateName, setTemplateName] = useState<string>('');

  const currentWorkspace = useSelector(
    (state: RootState) => state.workspaces.currentWorkspace.currentWorkspace,
  );
  const currentUserRole = useSelector((state: RootState) => state.workspaces.userPermission.currentUserRole);

  const { data, isLoading } = useQuery(
    ['get/checklist-template', search, assignees, author, startDate, endDate],
    async () => axios({
      url: `/api/checklist-template/?workspace=${currentWorkspace.id}`,
      method: 'get',
      params: {
        search,
        assignee: assignees,
        author,
        start_date: startDate !== undefined ? moment(startDate).format('MMMM DD,YYYY') : null,
        end_date: endDate !== undefined ? moment(endDate).format('MMMM DD,YYYY') : null,
      },
    }),
    {
      enabled: currentWorkspace.id !== 0,
      select: (res: AxiosResponse<Iresponse>) => res.data.detail,
    },
  );
  const handleResetFilters = (): void => {
    setSearch('');
    setAssignees([]);
    setAuthor([]);
    setStartDate(undefined);
    setEndDate(undefined);
  };

  const { mutate: deleteTemplate, isLoading: deleteLoader } = useMutation(
    async (id: number | string) => axios({
      url: `/api/checklist-template/${id}`,
      method: 'DELETE',
    }),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries('get/checklist-template').then();
        enqueueSnackbar('Deleted Successfully');
      },
    },
  );

  const getChecklistPagePermissions = (): boolean => {
    if (currentUserRole !== null) {
      if (currentUserRole.role !== 2) {
        return true;
      }
      return false;
    }
    return true;
  };

  const renderAuthor = (id: number): JSX.Element => {
    const authors = currentWorkspace.members.filter(
      (singleAuthor) => singleAuthor.id === id,
    );
    if (authors.length === 1) {
      return (
        <div className='d-flex align-items-center'>
          <Avatar
            sx={{ height: '28px', width: '28px' }}
            src={`${process.env.REACT_APP_IMAGE_URL}${authors[0].avatar}`}
          />
          <span style={{ paddingLeft: '16px' }}>
            {authors[0].name}
          </span>
        </div>
      );
    }
    return (
      <div className='table-cell-wrapper'>
        <Avatar
          sx={{ height: '28px', width: '28px' }}
          src=''
        />
        <span style={{ paddingLeft: '16px' }}>No Author</span>
      </div>
    );
  };

  const { mutate: onCreateChecklistTemplate } = useMutation(async () => axios({
    url: `/api/checklist-template/?workspace=${currentWorkspace.id}`,
    method: 'post',
    data: {
      template_name: templateName,
    },
  }), {
    onSuccess: (res) => {
      navigate(`/workspace/settings/create-checklist-template/${res.data.detail.id}`);
      setOpen(false);
      setTemplateName('');
    },
    onError: (res: IErrorResponse) => {
      if (res.data.response.code === 'unique') {
        enqueueSnackbar('Template Name Already Exist');
      }
    },
  });

  const { mutate: onDuplicateChecklistTemplate, isLoading: duplicateLoader } = useMutation(
    async () => axios({
      url: '/api/checklist-template/duplicate_checklist/',
      method: 'post',
      data: {
        template: selectedId,
        template_name: templateName,
      },
    }),
    {
      onSuccess: async () => {
        setOpen(false);
        setTemplateName('');
        setIsDuplicate(false);
        await queryClient.invalidateQueries('get/checklist-template').then();
        enqueueSnackbar('Duplicate Successfully');
      },
    },
  );

  const handleCreate = (): void => {
    if (isDuplicate) {
      onDuplicateChecklistTemplate();
    } else {
      onCreateChecklistTemplate();
    }
  };

  const columns = useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'template_name',
        width: '30%',
        Cell: (cell: Cell<IDataObject>): JSX.Element => {
          const { value, row } = cell;
          const { original } = row;
          const newVal: string = value;
          return (
            <div
              style={{ color: '#00CFA1' }}
              aria-hidden='true'
              onClick={getChecklistPagePermissions() ? (): void => {
                navigate(`/workspace/settings/create-checklist-template/${original.id}`);
              } : undefined}
            >
              {newVal}
            </div>
          );
        },
      },
      {
        Header: 'Task',
        accessor: 'num_of_tasks',
        width: '13%',
      },
      {
        Header: 'Assignees',
        accessor: 'assignees',
        width: '13%',
        Cell: (cell: Cell<IDataObject>): JSX.Element => {
          const { value } = cell;
          const newVal: [] = value;
          return (
            <AvatarGroup max={3} className='flex-row-reverse' style={{ width: 'fit-content' }}>
              {newVal.map((assignee: Iassignee) => (
                <Avatar alt={assignee.name} src={`${process.env.REACT_APP_IMAGE_URL}${assignee.avatar}`} sx={{ height: '28px', width: '28px' }} />
              ))}
            </AvatarGroup>
          );
        },
      },
      {
        Header: 'Author',
        accessor: 'author',
        width: '20%',
        Cell: (cell: Cell<IDataObject>): JSX.Element => {
          const { value } = cell;
          const newVal: number = value;
          return (
            <div>
              {renderAuthor(newVal)}
            </div>
          );
        },
      },
      {
        Header: 'Created',
        accessor: 'created_at',
        width: '23%',

        Cell: (cell: Cell<IDataObject>): JSX.Element => {
          const { value } = cell;
          const newVal: string = value;
          return (
            <div>
              {moment(newVal).format('LLL')}
            </div>
          );
        },
      },
      {
        Header: '',
        accessor: 'account_new',
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
              {getChecklistPagePermissions()
              && (
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
                                    navigate(`/workspace/settings/create-checklist-template/${original.id}`);
                                    popupState.close();
                                  }}
                                  aria-hidden='true'
                                >
                                  <i className='fas fa-pen edit-icon fa-lg edit-delete-icon' />
                                  <span className='edit-delete-text '> Edit</span>
                                </div>
                                <div
                                  className='chart-btn'
                                  onClick={(): void => {
                                    setOpen(true);
                                    setIsDuplicate(true);
                                    setSelectedId(original.id);
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
                                    deleteTemplate(original.id);
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
              )}
            </div>
          );
        },
      },
    ],
    [currentWorkspace],
  );

  return (
    <>
      {data?.length === 0 && search === '' && assignees.length === 0 && author.length === 0 && startDate === undefined && endDate === undefined
        ? (
          <div className='empty-array-wrapper'>
            <p>No checklist templates</p>
            <div className='create-new-button'>
              <PrimayButton
                onClick={(): void => {
                  setOpen(true);
                }}
              >
                Create new
              </PrimayButton>
            </div>
          </div>
        )
        : (
          <div className='checklist-wrapper'>
            <div className='header'>
              <Typography className='header-text'>Checklists</Typography>
              <div className='right-side'>
                <div className='search-wrapper'>
                  <StradaSearch value={search} setSearch={setSearch} placeholder='Search' />
                </div>
                <div className='button-wrapper'>
                  <PrimayButton
                    onClick={(): void => {
                      setOpen(true);
                    }}
                  >
                    Create new
                  </PrimayButton>
                </div>
              </div>
            </div>
            <div className='filters-wrapper'>
              <Filters
                assignees={assignees}
                setAssignees={setAssignees}
                author={author}
                setAuthor={setAuthor}
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
              />
            </div>
            { data?.length !== 0
              ? (
                <div className='vendor-table-wrapper'>
                  <Divider sx={{ mt: 3, mb: 0.9 }} />
                  {isLoading || deleteLoader || duplicateLoader ? <div style={{ height: '60vh' }} className='vh-50 d-flex justify-content-center align-items-center'><CustomLoader /></div>
                    : (
                      <CustomTable
                        {...{
                          columns,
                          data: data !== undefined ? data : [],
                        }}
                      />
                    )}
                </div>
              )
              : (
                <div className='empty-array-wrapper'>
                  <p>No templates were found matching your search</p>
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
      >
        <DialogContent style={{ width: 500, marginBottom: '20px' }}>
          <p className='create-template-title'>{isDuplicate ? 'Create Duplicate Template' : 'Create Template'}</p>
          <div className='create-template-div'>
            <InputField
              type='text'
              label='Name'
              name='name'
              value={templateName}
              // control={control}
              onChange={(event): void => { setTemplateName(event.target.value); }}
            />
          </div>
        </DialogContent>
        <DialogActions style={{ paddingRight: '20px' }}>
          <Button
            style={{ textTransform: 'inherit' }}
            onClick={(): void => {
              setOpen(false);
              setIsDuplicate(false);
            }}
            color='primary'
          >
            Cancel
          </Button>
          <Button
            disabled={templateName === ''}
            variant='contained'
            onClick={(): void => { handleCreate(); }}
            style={{ textTransform: 'inherit', color: templateName !== '' ? 'white' : '#C6C6C6', background: templateName !== '' ? '#00CFA1' : '#EBEBE4' }}
            autoFocus
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
