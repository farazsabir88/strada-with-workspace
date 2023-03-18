/* eslint-disable @typescript-eslint/prefer-optional-chain */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/button-has-type */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import type { AxiosResponse } from 'axios';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import moment from 'moment';
import { useSnackbar } from 'notistack';
import StatusTag from 'shared-components/components/StatusTag';
import StradaLoader from 'shared-components/components/StradaLoader';
import type { IEvent } from 'admin/buildingSection/budget-calendar/types';
import SideSheet from 'admin/buildingSection/budget-calendar/components/SideSheet';
import type { EventsResponse } from 'admin/buildingSection/building-dashboard/types';
import { useDispatch } from 'react-redux';
import { setSideSheetData, setSideSheetLoader } from 'admin/store/SideSheetData';
import './_reports.scss';

export default function Reports(): JSX.Element {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const [dataToEdit, setDataToEdit] = useState<IEvent | null>(null);
  const [openAllEvents, setOpenAllEvents] = useState(false);
  const [openOtherEvents, setOpenOtherEvents] = useState(false);
  // const [loadMore, setLoadMore] = useState(false);
  const dispatch = useDispatch();
  const [cursor, setCursor] = useState<string | null>(null);
  const [collapseOne, setCollapseOne] = useState<boolean>(false);
  const [collapseTwo, setCollapseTwo] = useState<boolean>(false);
  const [userAllEvents, setUserAllEvents] = useState<IEvent[]>([]);
  const [other, setOthers] = useState<IEvent[]>([]);
  const [loadMoreResults, setLoadMoreResults] = useState<IEvent[]>([]);
  const [loadMoreClick, setLoadMoreClick] = React.useState(false);
  const [showLoadMore, setShowLoadMore] = useState(true);

  const [cursorPointer, setCursorPointer] = React.useState<string[] >([]);
  const [cursorQuery, setCursorQuery] = React.useState<string >();
  const [cursorIndex, setCursorIndex] = React.useState<number >(0);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const {
    data: userCreatedEvents = { next: null, previous: null, results: [] },
    isLoading: loadingEvents,
  } = useQuery(
    ['user-created-events'],
    async () => axios({
      url:
          cursor === null
            ? '/api/dashboard/user-created-events/'
            : `/api/dashboard/user-created-events/?cursor=${cursor}`,
      method: 'GET',
    }),
    {
      select: (res: AxiosResponse<EventsResponse>) => res.data,
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onSuccess: async (): Promise<void> => {
        if (dataToEdit !== null && cursorPointer.length !== 0) {
          setUserAllEvents([]);
          setLoadMoreResults([]);
          const fetch = async (): Promise<void> => {
            await queryClient.invalidateQueries('user-assigned-events-cursor');
          };
          // setLoadMoreClick(true);
          dispatch(setSideSheetLoader(true));
          setCursorQuery(cursorPointer[0]);
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          await fetch().then();
          // }
        }
      },
    },
  );

  const {
    data: loadMoreUserCreatedEvents = { next: null, previous: null, results: [] },
    isLoading: loadMoreLoader,
  } = useQuery(
    ['user-created-events-load', cursor],
    async () => axios({

      url: `/api/dashboard/user-created-events?cursor=${cursor}`,
      method: 'GET',
    }),
    {
      select: (res: AxiosResponse<EventsResponse>) => res.data,
      enabled: cursor !== null,
    },
  );
  const {
    data: cursorRequest = { next: null, previous: null, results: [] },
    // isLoading: loadMore,
  } = useQuery(
    ['user-created-events-cursor', cursorQuery],
    async () => axios({
      url: `/api/dashboard/user-created-events?cursor=${cursorQuery}`,
      method: 'GET',
    }),
    {
      select: (res: AxiosResponse<EventsResponse>) => res.data,
      enabled: cursorQuery !== undefined,
      onSuccess: (): void => {
        setLoadMoreClick(true);
        setCursorIndex((pre) => pre + 1);
      },
    },
  );

  const {
    data: otherEvents = { next: null, previous: null, results: [] },
    isLoading: loadingOtherEvents,
  } = useQuery(
    ['others-events'],
    async () => axios({
      url: '/api/dashboard/others-events/',
      method: 'GET',
    }),
    {
      select: (res: AxiosResponse<EventsResponse>) => res.data,
      onSuccess: (data: EventsResponse): void => {
        setOthers(data.results);
      },
      onError: (): void => {
        enqueueSnackbar('Other events loading failed', { variant: 'error' });
      },
    },
  );
  useEffect(() => {
    if (cursorRequest.results.length > 0 && cursorPointer.length !== 0 && cursorQuery !== undefined && loadMoreClick) {
      setCursorQuery(cursorPointer[cursorIndex]);
      setLoadMoreResults([...loadMoreResults, ...cursorRequest.results]);
      setLoadMoreClick(false);
    }
  }, [cursorRequest.results, loadMoreClick]);

  useEffect(() => {
    if (loadMoreResults.length > 0 && cursorQuery === undefined) {
      setUserAllEvents([...userCreatedEvents.results, ...loadMoreResults]);
      setCursorIndex(0);
      setCursorQuery(undefined);
      dispatch(setSideSheetLoader(false));
    }
  }, [loadMoreResults]);

  useEffect(() => {
    if (cursorQuery === undefined)setLoadMoreResults([]);
  }, [cursorQuery]);

  useEffect(() => {
    if (cursor !== null) {
      if (!cursorPointer.includes(cursor)) { setCursorPointer([...cursorPointer, cursor]); }
    }
  }, [cursor]);
  useEffect(() => {
    if (cursor !== null) {
      setUserAllEvents([...userAllEvents, ...loadMoreUserCreatedEvents.results]);
    }
  }, [loadMoreUserCreatedEvents.results]);

  useEffect(() => {
    if (loadMoreUserCreatedEvents.next === null && loadMoreUserCreatedEvents.results.length > 0) setShowLoadMore(false);
  }, [loadMoreUserCreatedEvents.next, loadMoreUserCreatedEvents.results]);
  useEffect(() => {
    if (userCreatedEvents.results.length < 25) { setShowLoadMore(false); } else setShowLoadMore(true);
  }, [userCreatedEvents.results]);
  useEffect(() => {
    if (openAllEvents && dataToEdit !== null) {
      const newDataToEdit = userAllEvents.filter(
        (event) => event.id === dataToEdit.id,
      );
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      if (newDataToEdit[0]) {
        setDataToEdit(newDataToEdit[0]);
      }
    }
  }, [userAllEvents, userCreatedEvents.results]);
  const handleClickMore = (): void => {
    if (userCreatedEvents.next !== null && cursorPointer.length === 0) {
      const url = new URL(userCreatedEvents.next);
      const cursorText = url.searchParams.get('cursor');
      setCursor(cursorText);
    } else if (loadMoreUserCreatedEvents.next !== null) {
      const url = new URL(loadMoreUserCreatedEvents.next);
      const cursorText = url.searchParams.get('cursor');
      setCursor(cursorText);
    } else if (cursorRequest.next !== null) {
      const url = new URL(cursorRequest.next);
      const cursorText = url.searchParams.get('cursor');
      setCursor(cursorText);
    }
  };

  const handleRowClickOther = (data: IEvent): void => {
    setOpenOtherEvents(true);
    setOpenAllEvents(false);
    setDataToEdit(data);
  };
  const handleRowClickAll = (data: IEvent): void => {
    setOpenAllEvents(true);
    setOpenOtherEvents(false);
    setDataToEdit(data);
  };
  const handleClose = (): void => {
    setOpenAllEvents(false);
    setOpenOtherEvents(false);
    setDataToEdit(null);
    setCursorQuery(undefined);
    // setLoadMoreResults([]);
  };

  useEffect(() => {
    if (openAllEvents && dataToEdit !== null) {
      const newDataToEdit = userCreatedEvents.results.filter(
        (event) => event.id === dataToEdit.id,
      );
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      if (newDataToEdit[0]) {
        setDataToEdit(newDataToEdit[0]);
      }
    }

    if (openOtherEvents && dataToEdit !== null) {
      const newDataToEdit = otherEvents.results.filter(
        (event) => event.id === dataToEdit.id,
      );
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      if (newDataToEdit[0]) {
        setDataToEdit(newDataToEdit[0]);
      } else {
        setDataToEdit(null);
        setOpenOtherEvents(false);
      }
    }
  }, [userCreatedEvents.results, otherEvents, userAllEvents]);

  useEffect(() => {
    dispatch(setSideSheetData(dataToEdit));
  }, [dataToEdit]);

  useEffect(() => {
    setOpenAllEvents(false);
    setOpenAllEvents(false);
  }, [collapseOne, collapseTwo]);
  useEffect(() => {
    setCursorQuery(undefined);
  }, [dataToEdit?.id]);

  useEffect(() => {
    dispatch(setSideSheetLoader(false));
    setUserAllEvents(userCreatedEvents.results);
  }, [userCreatedEvents.results]);

  const scrollIntoView = (): void => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  useEffect(() => {
    scrollIntoView();
  }, [dataToEdit]);
  return (
    <div>
      <StradaLoader
        open={loadingEvents || loadingOtherEvents || loadMoreLoader}
        message='Loading Reports'
      />
      {openAllEvents && (
        <SideSheet
          open={openAllEvents}
          handleClose={handleClose}
        />
      )}
      {openOtherEvents && (
        <SideSheet
          open={openOtherEvents}
          handleClose={handleClose}
        />
      )}

      <Table className='my-event-table'>
        <TableHead>
          <TableRow>
            <TableCell className='met-h-cell' style={{ width: '35%' }}>
              {' '}
              Event Name
              {' '}
            </TableCell>
            <TableCell className='met-h-cell' style={{ width: '13%' }}>
              {' '}
              Assignee
              {' '}
            </TableCell>
            <TableCell className='met-h-cell' style={{ width: '12%' }}>
              {' '}
              Status
              {' '}
            </TableCell>
            <TableCell className='met-h-cell' style={{ width: '9%' }}>
              {' '}
              Due Date
              {' '}
            </TableCell>
            <TableCell
              className='met-h-cell'
              style={{ width: '16%' }}
            >
              {' '}
              Building
              {' '}
            </TableCell>
            <TableCell
              className='met-h-cell'
              style={{ width: '15%' }}
            >
              {' '}
              Workspace
              {' '}
            </TableCell>
          </TableRow>
        </TableHead>

        <TableRow
          className='table-head-title'
          onClick={(): void => {
            setCollapseOne(!collapseOne);
          }}
        >
          {!collapseOne ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
          I`ve Created
        </TableRow>

        <TableBody>
          {!collapseOne
            && userAllEvents.map((ev) => (
              <TableRow
                onClick={(): void => {
                  handleRowClickAll(ev);
                }}
                className='row-hover'
              >
                <TableCell className='met-b-cell' style={{ width: '35%' }}>
                  <div className='event-name-cell'>
                    <p>

                      {ev.title}
                    </p>
                  </div>
                </TableCell>
                <TableCell className='met-b-cell' style={{ width: '13%' }}>
                  {ev.assignee !== null ? (
                    <div className='assignee-cell' ref={ev.id === dataToEdit?.id ? scrollRef : null}>
                      <Avatar
                        className='ass-avatar'
                        src={`${process.env.REACT_APP_IMAGE_URL}/api/${ev.assignee.avatar}`}
                      />

                      <span>
                        {' '}
                        {ev.assignee.name}
                      </span>
                    </div>
                  ) : (
                    <div className='ass-avatar'>
                      {' '}
                      <span>Not Assigned</span>
                      {' '}
                    </div>
                  )}
                </TableCell>
                <TableCell className='met-b-cell' style={{ width: '12%' }}>
                  <StatusTag value={ev.status ? Number(ev.status) : 1} />
                </TableCell>
                <TableCell className='met-b-cell' style={{ width: '9%' }}>
                  <span
                    className={
                      moment(ev.due_date)
                        .isAfter(new Date())
                        ? 'normal'
                        : 'passed'
                    }
                  >
                    {ev.due_date
                     && moment(ev.due_date).format('MMM D')}
                  </span>
                </TableCell>
                <TableCell
                  className='met-b-cell'
                  style={{ width: '16%' }}
                >
                  {ev.building !== null && ev.building !== undefined && ev.building.address && (
                    <div className='building-cell'>
                      {
                        ev.building.address
                      }
                    </div>
                  )}
                </TableCell>
                <TableCell
                  className='met-b-cell'
                  style={{ width: '15%', borderRight: 0 }}
                >
                  {ev.workspace?.name
                    ? (
                      <div className='building-cell'>
                        <Avatar sx={{ bgcolor: '#00CFA1' }} variant='rounded'>
                          {ev.workspace.name[0]}
                        </Avatar>
                        { ev.workspace.name}
                      </div>
                    )
                    : null}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>

        {!collapseOne && (
          <TableRow>
            <TableCell colSpan={6}>
              <div className='myevent-load-more'>
                { showLoadMore && <button onClick={handleClickMore}> Load More </button>}
              </div>
            </TableCell>
          </TableRow>
        )}

        <TableRow
          className='table-head-title'
          onClick={(): void => {
            setCollapseTwo(!collapseTwo);
          }}
        >
          {!collapseTwo ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
          Assigned to Others
        </TableRow>

        <TableBody>
          {!collapseTwo
            && other.map((ev) => (
              <TableRow
                onClick={(): void => {
                  handleRowClickOther(ev);
                }}
                className='row-hover'
              >
                <TableCell className='met-b-cell' style={{ width: '40%' }}>
                  <div className='event-name-cell'>
                    <p>
                      {' '}
                      {ev.title}
                      {' '}
                    </p>
                  </div>
                </TableCell>
                <TableCell className='met-b-cell' style={{ width: '13%' }}>
                  {ev.assignee !== null ? (
                    <div className='assignee-cell'>
                      <Avatar
                        variant='square'
                        className='ass-avatar'
                        src={`${process.env.REACT_APP_IMAGE_URL}/api/${ev.assignee.avatar}`}
                      />
                      <span>
                        {' '}
                        {ev.assignee.name}
                      </span>
                    </div>
                  ) : (
                    <div className='ass-avatar'>
                      {' '}
                      <span>Not Assigned</span>
                      {' '}
                    </div>
                  )}
                </TableCell>
                <TableCell className='met-b-cell' style={{ width: '12%' }}>
                  <StatusTag value={ev.status ? Number(ev.status) : 1} />
                </TableCell>
                <TableCell className='met-b-cell' style={{ width: '9%' }}>
                  <span
                    className={
                      moment(ev.due_date)
                        .isAfter(new Date())
                        ? 'normal'
                        : 'passed'
                    }
                  >
                    {ev.due_date
                      ? moment(ev.due_date).format('MMM D')
                      : ''}
                  </span>
                </TableCell>
                <TableCell
                  className='met-b-cell'
                  style={{ width: '16%' }}
                >
                  {ev.building !== null && ev.building !== undefined && ev.building.address && (
                    <div className='building-cell'>
                      {
                        ev.building.address
                      }
                    </div>
                  )}
                </TableCell>
                <TableCell
                  className='met-b-cell'
                  style={{ width: '15', borderRight: 0 }}
                >
                  {ev.workspace?.name
                    ? (
                      <div className='building-cell'>
                        <Avatar sx={{ bgcolor: '#00CFA1' }} variant='rounded'>
                          {ev.workspace.name[0]}
                        </Avatar>
                        { ev.workspace.name}
                      </div>
                    )
                    : null}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}
