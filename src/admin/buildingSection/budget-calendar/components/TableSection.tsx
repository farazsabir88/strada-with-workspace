/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { Avatar, InputBase } from '@mui/material';
import moment from 'moment';
import React, { useEffect, useMemo, useState } from 'react';
import type { Cell } from 'react-table';
import _, { isNull } from 'lodash';
import StandardButton from 'shared-components/components/StandardButton';
import BudgetCalendarTable from 'shared-components/tables/BudgetCalendarTable';
import type { IDataObject } from 'formsTypes';
import { useQuery } from 'react-query';
import type { AxiosResponse } from 'axios';
import { setCurrentBuilding } from 'admin/store/currentBuildingSlice';
import axios from 'axios';
import type { Ibuilding } from 'types';
import { useDispatch, useSelector } from 'react-redux';
import { setSideSheetData, setMonthChange } from 'admin/store/SideSheetData';
import { useNavigate } from 'react-router-dom';
import type { RootState } from 'mainStore';

import type {
  IAssigneeInfo,
  IEvent,
  ISingleEventProps,
  ITableSectionProps,
  ITags,
} from '../types';
import SideSheet from './SideSheet';

interface IVendorProps {
  name: string;
  value: number | string;
}

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
    color: 'rgba(249, 168, 37, 0.87)',
    background: 'rgba(249, 168, 37, 0.08)',
  },
  {
    name: 'Scheduled',
    value: 3,
    color: 'rgba(33, 150, 243, 0.87)',
    background: 'rgba(33, 150, 243, 0.08)',
  },
  {
    name: 'Completed',
    value: 4,
    color: 'rgb(76, 175, 80)',
    background: 'rgba(76, 175, 80, 0.08)',
  },
  {
    name: 'As Needed',
    value: 5,
    color: 'rgb(0, 172, 193)',
    background: 'rgba(0, 172, 193, 0.08)',
  },
  {
    name: 'Contingency',
    value: 6,
    color: 'rgb(216, 27, 96)',
    background: 'rgba(216, 27, 96, 0.08)',
  },
  {
    name: 'Contract',
    value: 7,
    color: 'rgb(94, 53, 177)',
    background: 'rgba(94, 53, 177, 0.08)',
  },
];

const allMonths: IVendorProps[] = [
  {
    name: 'January',
    value: 1,
  },
  {
    name: 'February',
    value: 2,
  },
  {
    name: 'March',
    value: 3,
  },
  {
    name: 'April',
    value: 4,
  },
  {
    name: 'May',
    value: 5,
  },
  {
    name: 'June',
    value: 6,
  },
  {
    name: 'July',
    value: 7,
  },
  {
    name: 'August',
    value: 8,
  },
  {
    name: 'September',
    value: 9,
  },
  {
    name: 'October',
    value: 10,
  },
  {
    name: 'November',
    value: 11,
  },
  {
    name: 'December',
    value: 12,
  },
];

export default function TableSection(props: ITableSectionProps): JSX.Element {
  const {
    events, newEventOpen, setNewEventOpen, createEvent, setDate, dateYear,
  } = props;
  const dispatch = useDispatch();

  const [title, setTitle] = useState<string>('');
  const [open, setOpen] = useState(false);
  const [dataToEdit, setDataToEdit] = useState<IEvent | null>(null);
  const urlString = window.location.href;
  const url = new URL(urlString);
  const urlEventId = url.searchParams.get('eventId');
  const navigate = useNavigate();
  const monthChange = useSelector((state: RootState) => state.workspaces.sideSheetData.monthChange);
  const buildingsData = useSelector((state: RootState) => state.workspaces.buildingsData.data);
  useEffect(() => {
    if (urlEventId !== null) {
      const eventAgainstId = events.filter((ev) => ev.id === Number(urlEventId));
      if (eventAgainstId.length > 0) {
        setDataToEdit(eventAgainstId[0]);
        setOpen(true);
      }
    }
  }, [urlEventId, url, events]);

  useQuery(['get/single-sidesheet', urlEventId, url], async () => axios({
    url: `/api/budget-calendar/event/${urlEventId}`,
    method: 'GET',
  }), {
    onSuccess: (res: AxiosResponse<ISingleEventProps>) => {
      if (urlEventId !== null && urlEventId !== '' && setDate !== undefined) {
        const newYear = moment(res.data.detail.date).format('YYYY');
        const newMonth = res.data.detail.month;
        if (dateYear === '') {
          setDate(new Date(new Date(`${newYear}-${newMonth}-03`)));
        }
      }
      const buildingData = buildingsData.filter((data: Ibuilding) => data.id === res.data.detail.building.id);
      dispatch(setCurrentBuilding(buildingData[0]));
    },
    enabled: urlEventId !== null,
  });

  const handleOnBlur = (): void => {
    if (title !== '') {
      createEvent(title);
      setTitle('');
    }
    setNewEventOpen(false);
  };
  const handleOnEnterPress = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ): void => {
    if (e.key === 'Enter' && title !== '') {
      setNewEventOpen(false);
      createEvent(title);
      setTitle('');
    }
  };

  const handleRowClick = (data: IEvent): void => {
    setOpen(true);
    navigate(`/workspace/budget-calendar?eventId=${data.id}`);
  };

  const handleClose = (): void => {
    setOpen(false);
    setDataToEdit(null);
  };

  useEffect(() => {
    document.getElementById('sidesheet-header')?.scrollIntoView();
    dispatch(setSideSheetData(dataToEdit));
  }, [dataToEdit]);

  useEffect(() => {
    if (open && dataToEdit !== null && !monthChange) {
      const newDataToEdit = events.filter(
        (event) => event.id === dataToEdit.id,
      );
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      if (newDataToEdit[0]) {
        setDataToEdit(newDataToEdit[0]);
      } else {
        setDataToEdit(dataToEdit);
      }
    }
    dispatch(setMonthChange(false));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events]);

  const getPOAmount = (event: IEvent): JSX.Element => {
    if (event.po_amount === null) {
      return (<div>-</div>);
    }
    if (event.po_status === true || event.po_closed) {
      return (<div>{`$${event.po_amount}`}</div>);
    }

    return (<div><span style={{ backgroundColor: 'yellow' }}>{`$${event.po_amount}`}</span></div>);
  };
  const columns = useMemo(
    () => [
      {
        Header: 'Event Name',
        accessor: 'title',
      },
      {
        Header: 'Assignee',
        accessor: 'assignee_info',
        Cell: (cell: Cell<IDataObject>): JSX.Element => {
          const { value }: { value: IAssigneeInfo | null } = cell;
          if (!value) {
            return (
              <div className='table-assignee'>
                <Avatar className='assignee-avatar' />
                <p>No Assignee</p>
              </div>
            );
          }
          return (
            <div className='table-assignee'>
              <Avatar
                src={`${process.env.REACT_APP_IMAGE_URL}${value.avatar}`}
                className='assignee-avatar'
              />
              <p>{value.name}</p>
            </div>
          );
        },
      },
      {
        Header: 'Status',
        accessor: 'status',
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
        Header: 'Property',
        accessor: 'building',
        Cell: (cell: Cell<IDataObject>): JSX.Element => {
          const { value } = cell;
          return (
            <div>
              {value !== null ? value.address : ''}
            </div>
          );
        },
      },
      {
        Header: 'Amount Budgeted',
        accessor: 'amount_budget',
        Cell: (cell: Cell<IDataObject>): JSX.Element => {
          const { value } = cell;
          return (
            <div>
              {' '}
              {value !== null ? `$ ${value}` : '-'}
              {' '}
            </div>
          );
        },
      },
      {
        Header: 'Vendor',
        accessor: 'vendor',
        Cell: (cell: Cell<IDataObject>): JSX.Element => {
          const { value } = cell;
          if (value === null || _.isEmpty(value)) {
            return <div>-</div>;
          }
          return <div>{value?.label}</div>;
        },
      },
      {
        Header: 'G/L Code',
        accessor: 'gl',
        Cell: (cell: Cell<IDataObject>): JSX.Element => {
          const { value } = cell;
          if (value === null || _.isEmpty(value)) {
            return <div>-</div>;
          }
          return <div>{value?.label}</div>;
        },
      },
      {
        Header: 'Due Date',
        accessor: 'due_date',
        Cell: (cell: Cell<IDataObject>): JSX.Element => {
          const { value }: { value: string | null } = cell;
          if (value === null || value === '') {
            return <div>-</div>;
          }
          return <div>{moment(value).format('MMM DD')}</div>;
        },
      },
      {
        Header: 'Date Range',
        accessor: 'event_start_date',
        Cell: (cell: Cell<IDataObject>): JSX.Element => {
          const { row } = cell;
          const { original } = row;
          if (isNull(original.event_start_date) && isNull(original.event_start_date)) {
            return <div>-</div>;
          }
          return (
            <div>
              {!isNull(original.event_start_date) && moment(original.event_start_date).format('MMM DD')}
              {!isNull(original.event_start_date) && !isNull(original.event_start_date) && '-'}
              {!isNull(original.event_end_date) && moment(original.event_end_date).format('MMM DD')}
            </div>
          );
        },
      },
      {
        Header: 'Project Tags',
        accessor: 'tags',
        Cell: (cell: Cell<IDataObject>): JSX.Element => {
          const { value }: { value: ITags[] } = cell;
          if (value.length === 0) {
            return <div>-</div>;
          }
          return <div style={{ padding: '6px' }}>{value.map((tag: ITags) => `${tag.name},`)}</div>;
        },
      },
      {
        Header: 'PO',
        accessor: 'po_amount',
        Cell: (cell: Cell<IDataObject>): JSX.Element => {
          const { row } = cell;
          const { original } = row;
          return (
            getPOAmount(original)
          );
        },
      },
      {
        Header: 'Cost',
        accessor: 'final_cost',
        Cell: (cell: Cell<IDataObject>): JSX.Element => {
          const { value } = cell;
          return (
            <div>
              {' '}
              {value !== null && value > 0 ? `$ ${value}` : '$0'}
              {' '}
            </div>
          );
        },
      },
      {
        Header: 'Month',
        accessor: 'month',
        Cell: (cell: Cell<IDataObject>): JSX.Element => {
          const { value } = cell;
          return (
            <div>
              {!Number.isNaN(value) && allMonths[value - 1].name}
            </div>
          );
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [events],
  );
  return (
    <div>
      <BudgetCalendarTable
        columns={columns}
        data={events}
        handleRowClick={handleRowClick}
      />
      <div className='new-event-block'>
        {newEventOpen && (
          <InputBase
            value={title}
            className='new-event-input'
            placeholder='Write a Event Name'
            onChange={(e): void => {
              const val: string = e.target.value;
              setTitle(val);
            }}
            onBlur={handleOnBlur}
            autoFocus
            onKeyPress={handleOnEnterPress}
          />
        )}
        <StandardButton
          className='add-event-btn'
          onClick={(): void => {
            setNewEventOpen(true);
          }}
        >
          {' '}
          Add event
          {' '}
        </StandardButton>
      </div>
      {open && (
        <SideSheet
          open={open}
          handleClose={handleClose}
        />
      )}

    </div>
  );
}
