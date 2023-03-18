/* eslint-disable @typescript-eslint/prefer-optional-chain */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/button-has-type */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import React, { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import type { AxiosResponse } from 'axios';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import {
  InputBase,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Avatar,
} from '@mui/material';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import moment from 'moment';
import type { DropResult } from 'react-beautiful-dnd';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useSelector, useDispatch } from 'react-redux';
import PrimayButton from 'shared-components/components/PrimayButton';
import StradaLoader from 'shared-components/components/StradaLoader';
import type { RootState } from 'mainStore';
import type { IEvent, ISingleEventResponse } from 'admin/buildingSection/budget-calendar/types';
import SideSheet from 'admin/buildingSection/budget-calendar/components/SideSheet';
import type { EventsResponse, PrioritizedEventsResponse } from 'admin/buildingSection/building-dashboard/types';
import {
  setSingleSideSheetData, setSideSheetData, setSideSheetLoader,
} from 'admin/store/SideSheetData';
import { arrayMoveImmutable } from 'array-move';
import CustomLoader from 'shared-components/components/CustomLoader';
import Filters from './Filters';

interface PriorityProps {
  event_id: number;
  index: number;
  priority: number;
}
const optionsList = [
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

export default function MyEvents(): JSX.Element {
  const userId = useSelector((state: RootState) => state.auth.user.id);
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const [unSignedFilterdData, setUnsignedFilterdData] = useState<IEvent[]>([]);
  const [loadMoreResults, setLoadMoreResults] = useState<IEvent[]>([]);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const [todayPriority, setTodayPriority] = useState<IEvent[]>([]);
  const [upcomingPriority, setUpcomingPriority] = useState<IEvent[]>([]);
  const [today, setToday] = useState<IEvent[]>([]);
  const [unSigned, setUnsigned] = useState<IEvent[]>([]);
  const [upcoming, setUpcoming] = useState<IEvent[]>([]);
  const [later, setLater] = useState<IEvent[]>([]);
  const [workspaceFilter, setWorkspaceFilter] = useState<number[]>([]);
  const [buildingFilter, setBuildingFilter] = useState<number[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loadMoreClick, setLoadMoreClick] = React.useState(false);
  const [showLoadMore, setShowLoadMore] = useState(true);
  const [laterPriority, setLaterPriority] = useState<IEvent[]>([]);
  const [open, setOpen] = useState(false);
  // const [test, setTest] = useState(true);
  // const ref = useRef(null);
  const [title, setTitle] = useState<string>('');
  const [newEventOpen, setNewEventOpen] = useState<boolean>(false);
  const [dataToEdit, setDataToEdit] = useState<IEvent | null>(null);
  const [cursorPointer, setCursorPointer] = React.useState<string[] >([]);
  const [cursorQuery, setCursorQuery] = React.useState<string >();
  const [cursorIndex, setCursorIndex] = React.useState<number >(0);
  const [cursor, setCursor] = useState<string | null>(null);

  const {
    data: unsignedEventData = { next: null, previous: null, results: [] },
    isLoading: loadingEvents,
  } = useQuery(
    ['user-assigned-events', workspaceFilter, buildingFilter],
    async () => axios({
      url: '/api/dashboard/user-assigned-events',
      method: 'GET',
      params: {
        property: buildingFilter,
        workspace: workspaceFilter,
      },
    }),
    {
      select: (res: AxiosResponse<EventsResponse>) => res.data,
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onSuccess: async (): Promise<void> => {
        if (dataToEdit !== null && cursorPointer.length !== 0) {
          setUnsignedFilterdData([]);
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

  // useEffect(() => {
  //   const fetch = async (): Promise<void> => {
  //     await queryClient.cancelQueries('user-assigned-events-load');
  //   };
  //   fetch().catch();
  // }, [cursor]);

  const {
    data: loadMoreUnsigned = { next: null, previous: null, results: [] },
    isLoading: loadMore,
  } = useQuery(
    ['user-assigned-events-load', cursor, workspaceFilter, buildingFilter],
    async () => axios({

      url: `/api/dashboard/user-assigned-events?cursor=${cursor}`,
      method: 'GET',
      params: {
        property: buildingFilter,
        workspace: workspaceFilter,
      },
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
    ['user-assigned-events-cursor', cursorQuery, workspaceFilter, buildingFilter],
    async () => axios({
      url: `/api/dashboard/user-assigned-events?cursor=${cursorQuery}`,
      method: 'GET',
      params: {
        property: buildingFilter,
        workspace: workspaceFilter,
      },
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

  const { data: prioritizedEvents = { later: [], upcoming: [], today: [] } } = useQuery(
    ['prioritized-events', workspaceFilter, buildingFilter],
    async () => axios({
      url: '/api/dashboard/prioritized-events/',
      method: 'GET',
      params: {
        property: buildingFilter,
        workspace: workspaceFilter,
      },
    }),
    {
      select: (res: AxiosResponse<PrioritizedEventsResponse>) => res.data.detail,
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
      setUnsignedFilterdData([...unsignedEventData.results, ...loadMoreResults]);
      setCursorIndex(0);
      setCursorQuery(undefined);
      dispatch(setSideSheetLoader(false));
    }
  }, [loadMoreResults]);
  useEffect(() => {
    if (cursorQuery === undefined && loadMoreUnsigned.next !== null)setLoadMoreResults([]);
  }, [cursorQuery]);

  useEffect(() => {
    if (cursor !== null) {
      if (!cursorPointer.includes(cursor)) { setCursorPointer([...cursorPointer, cursor]); }
    }
  }, [cursor]);

  useEffect(() => {
    setLaterPriority(prioritizedEvents.later);
    setUpcomingPriority(prioritizedEvents.upcoming);
    setTodayPriority(prioritizedEvents.today);
  }, [prioritizedEvents]);

  useEffect(() => {
    dispatch(setSideSheetLoader(false));
    setUnsignedFilterdData(unsignedEventData.results);
  }, [unsignedEventData.results]);

  useEffect(() => {
    if (cursor !== null) {
      setUnsignedFilterdData([...unSignedFilterdData, ...loadMoreUnsigned.results]);
      setShowLoadMore(true);
    }
  }, [loadMoreUnsigned.results]);

  useEffect(() => {
    if (loadMoreUnsigned.next === null && loadMoreUnsigned.results.length > 0) setShowLoadMore(false);
  }, [loadMoreUnsigned.results, loadMoreUnsigned.next]);

  useEffect(() => {
    if (buildingFilter.length > 0) {
      setShowLoadMore(false);
    } else setShowLoadMore(true);
  }, [buildingFilter]);

  useEffect(() => {
    if (unsignedEventData.results.length < 25) { setShowLoadMore(false); } else setShowLoadMore(true);
  }, [unsignedEventData.results]);
  const handleClose = (): void => {
    setOpen(false);
    setDataToEdit(null);
    setCursorQuery(undefined);
    setLoadMoreResults([]);
  };
  const handleRowClick = (data: IEvent): void => {
    setOpen(true);
    setDataToEdit(data);
  };

  const handleClickMore = (): void => {
    if (unsignedEventData.next !== null && cursorPointer.length === 0) {
      const url = new URL(unsignedEventData.next);
      const cursorText = url.searchParams.get('cursor');
      setCursor(cursorText);
    } else if (loadMoreUnsigned.next !== null) {
      const url = new URL(loadMoreUnsigned.next);
      const cursorText = url.searchParams.get('cursor');
      setCursor(cursorText);
    } else if (cursorRequest.next !== null) {
      const url = new URL(cursorRequest.next);
      const cursorText = url.searchParams.get('cursor');
      setCursor(cursorText);
    }

    if (unsignedEventData.next !== null && loadMoreUnsigned.next === null) {
      const url = new URL(unsignedEventData.next);
      const cursorText = url.searchParams.get('cursor');
      setCursor(cursorText);
    }
  };

  const qeuryCancel = async (): Promise<void> => {
    setShowLoadMore(false);
    setDataToEdit(null);
    setOpen(false);
    if (cursorPointer.length === 0) {
      await queryClient.invalidateQueries('user-assigned-events');
    } else {
      await queryClient.invalidateQueries('user-assigned-events-load');
    }
    !loadMore && handleClickMore();
  };

  const { mutate: createEvent, isLoading: creating } = useMutation(async (eventName: string) => axios({
    url: '/api/budget-calendar/event/',
    method: 'POST',
    data: {
      date: moment(new Date()).format('YYYY-MM-DD'),
      month: new Date().getMonth() + 1,
      occurrence: 4,
      status: 1,
      title: eventName,
      user: userId,
      assignee: userId,
    },
  }), {
    onSuccess: async (res: AxiosResponse<ISingleEventResponse>): Promise<void> => {
      dispatch(setSingleSideSheetData(res.data.detail));
      await queryClient.invalidateQueries('user-assigned-events')
        .then(() => {
          setUnsignedFilterdData([...unSignedFilterdData, res.data.detail]);
        });

      enqueueSnackbar('Event is created Successfully');
    },
    onError: (): void => {
      enqueueSnackbar('Event failed', { variant: 'error' });
    },
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

  useEffect(() => {
    if (open && dataToEdit !== null) {
      const newDataToEdit = unSignedFilterdData.filter(
        (event) => event.id === dataToEdit.id,
      );
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      if (newDataToEdit[0]) {
        setDataToEdit(newDataToEdit[0]);
      }
    }
  }, [unSignedFilterdData, unsignedEventData.results]);

  useEffect(() => {
    if (open && dataToEdit !== null) {
      let newDataToEdit = laterPriority.filter(
        (event) => event.id === dataToEdit.id,
      );
      if (newDataToEdit.length === 0) {
        newDataToEdit = todayPriority.filter(
          (event) => event.id === dataToEdit.id,
        );
      }
      if (newDataToEdit.length === 0) {
        newDataToEdit = upcomingPriority.filter(
          (event) => event.id === dataToEdit.id,
        );
      }
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      if (newDataToEdit[0]) {
        setDataToEdit(newDataToEdit[0]);
      } else {
        setDataToEdit(null);
        setOpen(false);
      }
    }
  }, [prioritizedEvents, todayPriority, laterPriority, upcomingPriority]);

  useEffect(() => {
    dispatch(setSideSheetData(dataToEdit));
  }, [dataToEdit]);
  useEffect(() => {
    setCursorQuery(undefined);
  }, [dataToEdit?.id]);

  const { mutate: updatePriority } = useMutation(async (priorityPayload: PriorityProps) => axios({
    url: `/api/dashboard/prioritized-events/${priorityPayload.event_id}/`,
    method: 'PATCH',
    data: {
      index: priorityPayload.index,
      priority: priorityPayload.priority,
    },
  }), {
    onSuccess: async (): Promise<void> => {
      if (later.length === 0 || today.length === 0 || upcoming.length === 0) {
        if (later.length === 0) {
          setLaterPriority([]);
        } else if (today.length === 0) {
          setTodayPriority([]);
        } else if (upcoming.length === 0) {
          setUpcomingPriority([]);
        }
        await queryClient.invalidateQueries('prioritized-events').then();
      }
    },
    onError: (): void => {
      enqueueSnackbar('Priority update failed', { variant: 'error' });
    },
  });

  const handleDragEnd = (results: DropResult): void => {
    const { source, destination } = results;

    if (destination) {
      if (source.droppableId === destination.droppableId) {
        if (source.index !== destination.index) {
          if (source.droppableId === '0') {
            const updated: IEvent[] = arrayMoveImmutable(unSignedFilterdData, source.index, destination.index);
            setUnsignedFilterdData(updated);
            updatePriority({ event_id: Number(results.draggableId), index: Number(destination.index), priority: Number(destination.droppableId) });
          } else if (source.droppableId === '1') {
            const updated: IEvent[] = arrayMoveImmutable(todayPriority, source.index, destination.index);
            setTodayPriority(updated);
            updatePriority({ event_id: Number(results.draggableId), index: Number(destination.index), priority: Number(destination.droppableId) });
          } else if (source.droppableId === '2') {
            const updated: IEvent[] = arrayMoveImmutable(upcomingPriority, source.index, destination.index);
            setUpcomingPriority(updated);
            updatePriority({ event_id: Number(results.draggableId), index: Number(destination.index), priority: Number(destination.droppableId) });
          } else if (source.droppableId === '3') {
            const updated: IEvent[] = arrayMoveImmutable(laterPriority, source.index, destination.index);
            setLaterPriority(updated);
            updatePriority({ event_id: Number(results.draggableId), index: Number(destination.index), priority: Number(destination.droppableId) });
          }
        }
      } else if (source.droppableId === '0' && destination.droppableId === '1') {
        const event = unSignedFilterdData[source.index];
        todayPriority.splice(destination.index, 0, event);
        setToday(todayPriority);
        // setTodayPriority(todayPriority);
        unSignedFilterdData.splice(source.index, 1);
        setUnsigned(unSignedFilterdData);
        // setUnsignedFilterdData(unSignedFilterdData);
        updatePriority({ event_id: Number(results.draggableId), index: Number(destination.index), priority: Number(destination.droppableId) });
      } else if (source.droppableId === '0' && destination.droppableId === '2') {
        const event = unSignedFilterdData[source.index];
        upcomingPriority.splice(destination.index, 0, event);
        setUpcoming(upcomingPriority);
        // setUpcomingPriority(upcomingPriority);
        unSignedFilterdData.splice(source.index, 1);
        setUnsigned(unSignedFilterdData);
        // setUnsignedFilterdData(unSignedFilterdData);
        updatePriority({ event_id: Number(results.draggableId), index: Number(destination.index), priority: Number(destination.droppableId) });
      } else if (source.droppableId === '0' && destination.droppableId === '3') {
        const event = unSignedFilterdData[source.index];
        laterPriority.splice(destination.index, 0, event);
        setLater(laterPriority);
        // setLaterPriority(laterPriority);
        unSignedFilterdData.splice(source.index, 1);
        setUnsigned(unSignedFilterdData);
        // setUnsignedFilterdData(unSignedFilterdData);
        updatePriority({ event_id: Number(results.draggableId), index: Number(destination.index), priority: Number(destination.droppableId) });
      } else if (source.droppableId === '1' && destination.droppableId === '0') {
        const event = todayPriority[source.index];
        unSignedFilterdData.splice(destination.index, 0, event);
        setUnsigned(unSignedFilterdData);
        // setUnsignedFilterdData(unSignedFilterdData);
        todayPriority.splice(source.index, 1);
        setToday(todayPriority);
        // setTodayPriority(todayPriority);
        updatePriority({ event_id: Number(results.draggableId), index: Number(destination.index), priority: Number(destination.droppableId) });
      } else if (source.droppableId === '1' && destination.droppableId === '2') {
        const event = todayPriority[source.index];
        todayPriority.splice(source.index, 1);
        setToday(todayPriority);
        // setTodayPriority(todayPriority);
        upcomingPriority.splice(destination.index, 0, event);
        setUpcoming(upcomingPriority);
        // setUpcomingPriority(upcomingPriority);
        updatePriority({ event_id: Number(results.draggableId), index: Number(destination.index), priority: Number(destination.droppableId) });
      } else if (source.droppableId === '1' && destination.droppableId === '3') {
        const event = todayPriority[source.index];
        todayPriority.splice(source.index, 1);
        setToday(todayPriority);
        // setTodayPriority(todayPriority);
        laterPriority.splice(destination.index, 0, event);
        setLater(laterPriority);
        // setLaterPriority(laterPriority);
        updatePriority({ event_id: Number(results.draggableId), index: Number(destination.index), priority: Number(destination.droppableId) });
      } else if (source.droppableId === '2' && destination.droppableId === '0') {
        const event = upcomingPriority[source.index];
        upcomingPriority.splice(source.index, 1);
        setUpcoming(upcomingPriority);
        // setUpcomingPriority(upcomingPriority);
        unSignedFilterdData.splice(destination.index, 0, event);
        // setUnsignedFilterdData(unSignedFilterdData);
        setUnsigned(unSignedFilterdData);
        updatePriority({ event_id: Number(results.draggableId), index: Number(destination.index), priority: Number(destination.droppableId) });
      } else if (source.droppableId === '2' && destination.droppableId === '1') {
        const event = upcomingPriority[source.index];
        upcomingPriority.splice(source.index, 1);
        setUpcoming(upcomingPriority);
        // setUpcomingPriority(upcomingPriority);
        todayPriority.splice(destination.index, 0, event);
        setToday(todayPriority);
        // setTodayPriority(todayPriority);
        updatePriority({ event_id: Number(results.draggableId), index: Number(destination.index), priority: Number(destination.droppableId) });
      } else if (source.droppableId === '2' && destination.droppableId === '3') {
        const event = upcomingPriority[source.index];
        upcomingPriority.splice(source.index, 1);
        setUpcoming(upcomingPriority);
        // setUpcomingPriority(upcomingPriority);
        laterPriority.splice(destination.index, 0, event);
        setLater(laterPriority);
        // setLaterPriority(laterPriority);
        updatePriority({ event_id: Number(results.draggableId), index: Number(destination.index), priority: Number(destination.droppableId) });
      } else if (source.droppableId === '3' && destination.droppableId === '0') {
        const event = laterPriority[source.index];
        laterPriority.splice(source.index, 1);
        setLater(laterPriority);
        // setLaterPriority(laterPriority);
        unSignedFilterdData.splice(destination.index, 0, event);
        setUnsigned(unSignedFilterdData);
        // setUnsignedFilterdData(unSignedFilterdData);
        updatePriority({ event_id: Number(results.draggableId), index: Number(destination.index), priority: Number(destination.droppableId) });
      } else if (source.droppableId === '3' && destination.droppableId === '1') {
        const event = laterPriority[source.index];
        laterPriority.splice(source.index, 1);
        setLater(laterPriority);
        // setLaterPriority(laterPriority);
        todayPriority.splice(destination.index, 0, event);
        setToday(todayPriority);
        // setTodayPriority(todayPriority);
        updatePriority({ event_id: Number(results.draggableId), index: Number(destination.index), priority: Number(destination.droppableId) });
      } else if (source.droppableId === '3' && destination.droppableId === '2') {
        const event = laterPriority[source.index];
        laterPriority.splice(source.index, 1);
        setLater(laterPriority);
        // setLaterPriority(laterPriority);
        upcomingPriority.splice(destination.index, 0, event);
        setUpcoming(upcomingPriority);
        // setUpcomingPriority(upcomingPriority);
        updatePriority({ event_id: Number(results.draggableId), index: Number(destination.index), priority: Number(destination.droppableId) });
      }
    }
  };
  useEffect(() => {
    unSigned.length >= 1 && setUnsignedFilterdData(unSigned);
    today.length >= 1 && setTodayPriority(today);
    upcoming.length >= 1 && setUpcomingPriority(upcoming);
    later.length >= 1 && setLaterPriority(later);
  }, [upcoming, later, today, unSigned]);

  const scrollIntoView = (): void => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  useEffect(() => {
    scrollIntoView();
  }, [dataToEdit]);
  return (
    <div className='my-events-wrapper'>
      <StradaLoader open={creating || loadingEvents} message={creating ? 'Creating Event...' : 'Loading Events'} />
      {open && (
        <SideSheet
          open={open}
          handleClose={handleClose}
        />
      )}

      <div className='header'>
        <div className='btn-wrapper'>
          <PrimayButton onClick={(): void => { setNewEventOpen(true); }}> Add events </PrimayButton>
        </div>
        <div>
          <Filters
            workspaceFilter={workspaceFilter}
            setWorkspaceFilter={setWorkspaceFilter}
            buildingFilter={buildingFilter}
            setBuildingFilter={setBuildingFilter}
          />
        </div>
      </div>

      <div className='tables-area' />
      <DragDropContext
        onDragEnd={handleDragEnd}
      >
        <Table className='my-event-table'>
          <TableHead>
            <TableRow key={`all-event-row'-${Math.random()}`}>
              <TableCell className='met-h-cell' style={{ width: '44%' }}>
                {' '}
                Event Name
                {' '}
              </TableCell>
              <TableCell className='met-h-cell' style={{ width: '12%' }}>
                {' '}
                Status
                {' '}
              </TableCell>
              <TableCell className='met-h-cell' style={{ width: '12%' }}>
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
                style={{ width: '16%', borderRight: 0 }}
              >
                {' '}
                Workspace
                {' '}
              </TableCell>
            </TableRow>
          </TableHead>

          <TableRow className='table-head-title'>Recently assigned</TableRow>
          {newEventOpen && (
            <TableRow>
              <TableCell className='met-b-cell' style={{ width: '44%', paddingLeft: 0 }}>
                <InputBase
                  value={title}
                  className='new-event-input'
                  placeholder='Write an Event Name'
                  // style={{ width: '100%' }}
                  onChange={(e): void => {
                    const val: string = e.target.value;
                    setTitle(val);
                  }}
                  onBlur={handleOnBlur}
                  autoFocus
                  onKeyPress={handleOnEnterPress}
                />
              </TableCell>
            </TableRow>
          )}
          <Droppable droppableId='0'>
            {(providedOne): JSX.Element => (
              <TableBody ref={providedOne.innerRef}>
                {unSignedFilterdData.length > 0 ? unSignedFilterdData.map((ev, index) => (
                  <Draggable
                    key={ev.id}
                    draggableId={String(ev.id)}
                    index={index}
                  >
                    {(provided1, snapshot): JSX.Element => (
                      <TableRow
                        hover
                        ref={provided1.innerRef}
                        onClick={(): void => {
                          handleRowClick(ev);
                        }}
                        className={snapshot.isDragging ? 'event-list-drag' : ''}
                        key={`all-event-row'-${Math.random()}`}
                        {...provided1.draggableProps}
                      >
                        <TableCell
                          className='met-b-cell'
                          style={{ width: '44%' }}
                        >
                          {' '}
                          <div
                            className='event-name-cell handle'
                            {...provided1.dragHandleProps}
                            ref={ev.id === dataToEdit?.id ? scrollRef : null}
                          >
                            <DragIndicatorIcon />
                            {' '}
                            <p>
                              {' '}
                              {ev.title}
                              {' '}
                            </p>
                            {' '}
                          </div>
                          {' '}
                        </TableCell>
                        <TableCell
                          className='met-b-cell'
                          style={{ width: '12%' }}
                        >
                          {/* <div>status</div> */}
                          <div style={{ background: optionsList.filter((item) => ev.status === item.value)[0].background, color: optionsList.filter((item) => ev.status === item.value)[0].color }} className='single-tag'>
                            {optionsList.filter((item) => ev.status === item.value)[0].name}
                          </div>

                        </TableCell>
                        <TableCell
                          className='met-b-cell'
                          style={{ width: '12%' }}
                        >
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
                              : ev.due_date}
                          </span>
                        </TableCell>
                        <TableCell
                          className='met-b-cell'
                          style={{ width: '16%' }}
                        >
                          {ev.building !== null && ev.building !== undefined && ev.building.address
                            ? (
                              <div className='building-cell'>
                                {
                                  ev.building.address
                                }
                              </div>
                            )
                            : null}
                        </TableCell>
                        <TableCell
                          className='met-b-cell'
                          style={{ width: '16%', borderRight: 0 }}
                        >
                          {ev.workspace !== null && ev.workspace !== undefined && ev.workspace?.name
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
                    )}
                  </Draggable>
                )) : (
                  <TableRow style={{ height: '48px' }}>
                    <TableCell colSpan={5} style={{ borderTop: '1px solid #e4e4e4' }} />
                  </TableRow>
                )}
              </TableBody>
            )}
          </Droppable>
          {/* <TableRow
            className='table-head-title'
            key={`all-event-row'-${Math.random()}`}
          /> */}

          <TableRow key={`all-event-row'-${Math.random()}`}>
            <TableCell colSpan={5}>
              { loadMore && <div style={{ height: '40vh' }} className='d-flex justify-content-center align-items-center'><CustomLoader /></div>}

              <div className='myevent-load-more'>
                {showLoadMore && !loadMore && <button onClick={qeuryCancel}> Load More </button>}
              </div>
            </TableCell>
          </TableRow>

          <TableRow
            className='table-head-title'
            key={`all-event-row'-${Math.random()}`}
            style={{ marginTop: '1.7rem' }}
          >
            Today
          </TableRow>
          <Droppable droppableId='1'>
            {(providedTwo): JSX.Element => (
              <TableBody ref={providedTwo.innerRef}>
                {todayPriority.length > 0
                  ? todayPriority.map((ev, index) => (
                    <Draggable
                      key={ev.id}
                      draggableId={String(ev.id)}
                      index={index}
                    >
                      {(provided2, snapshot): JSX.Element => (
                        <TableRow
                          hover
                          key={`all-event-row'-${Math.random()}`}
                          ref={provided2.innerRef}
                          onClick={(): void => {
                            handleRowClick(ev);
                          }}
                          className={snapshot.isDragging ? 'event-list-drag' : ''}
                          {...provided2.draggableProps}
                        >
                          <TableCell
                            className='met-b-cell'
                            style={{ width: '44%' }}
                          >
                            {' '}
                            <div
                              className='event-name-cell handle'
                              {...provided2.dragHandleProps}
                            >
                              <DragIndicatorIcon />
                              {' '}
                              <p>
                                {' '}
                                {ev.title}
                                {' '}
                              </p>
                              {' '}
                            </div>
                            {' '}
                          </TableCell>
                          <TableCell
                            className='met-b-cell'
                            style={{ width: '12%' }}
                          >
                            <div style={{ background: optionsList.filter((item) => ev.status === item.value)[0].background, color: optionsList.filter((item) => ev.status === item.value)[0].color }} className='single-tag'>
                              {optionsList.filter((item) => ev.status === item.value)[0].name}
                            </div>
                          </TableCell>
                          <TableCell
                            className='met-b-cell'
                            style={{ width: '12%' }}
                          >
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
                                : ev.due_date}
                            </span>
                          </TableCell>
                          <TableCell
                            className='met-b-cell'
                            style={{ width: '16%' }}
                          >
                            {ev.building !== null && ev.building !== undefined && ev.building.address
                              ? (
                                <div className='building-cell'>
                                  {
                                    ev.building.address
                                  }
                                </div>
                              )
                              : null}
                          </TableCell>
                          <TableCell
                            className='met-b-cell'
                            style={{ width: '16%', borderRight: 0 }}
                          >
                            {ev.workspace !== null && ev.workspace !== undefined && ev.workspace?.name
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
                      )}
                    </Draggable>
                  )) : (
                    <TableRow style={{ height: '48px' }}>
                      <TableCell colSpan={4} style={{ borderTop: '1px solid #e4e4e4' }} />
                    </TableRow>
                  )}
              </TableBody>
            )}
          </Droppable>
          <TableRow
            className='table-head-title'
            key={`all-event-row'-${Math.random()}`}
            style={{ marginTop: '1.7rem' }}
          />
          <div className='table-head-title'>Upcoming</div>
          <Droppable droppableId='2'>
            {(providedThree): JSX.Element => (
              <TableBody ref={providedThree.innerRef}>
                {upcomingPriority.length > 0 ? upcomingPriority.map((ev, index) => (
                  <Draggable
                    key={ev.id}
                    draggableId={String(ev.id)}
                    index={index}
                  >
                    {(provided, snapshot): JSX.Element => (
                      <TableRow
                        hover
                        key={`all-event-row'-${Math.random()}`}
                        ref={provided.innerRef}
                        onClick={(): void => {
                          handleRowClick(ev);
                        }}
                        className={snapshot.isDragging ? 'event-list-drag' : ''}
                        {...provided.draggableProps}
                      >
                        <TableCell
                          className='met-b-cell'
                          style={{ width: '44%', borderRight: 0 }}
                        >
                          {' '}
                          <div
                            className='event-name-cell handle'
                            {...provided.dragHandleProps}
                          >
                            <DragIndicatorIcon />
                            {' '}
                            <p>
                              {' '}
                              {ev.title}
                              {' '}
                            </p>
                            {' '}
                          </div>
                          {' '}
                        </TableCell>
                        <TableCell
                          className='met-b-cell'
                          style={{ width: '12%', borderLeft: '1px solid #e6e6e6' }}
                        >
                          <div style={{ background: optionsList.filter((item) => ev.status === item.value)[0].background, color: optionsList.filter((item) => ev.status === item.value)[0].color }} className='single-tag'>
                            {optionsList.filter((item) => ev.status === item.value)[0].name}
                          </div>
                        </TableCell>
                        <TableCell
                          className='met-b-cell'
                          style={{ width: '12%' }}
                        >
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
                              : ev.due_date}
                          </span>
                        </TableCell>
                        <TableCell
                          className='met-b-cell'
                          style={{ width: '16%' }}
                        >
                          {ev.building !== null && ev.building !== undefined && ev.building.address
                            ? (
                              <div className='building-cell'>
                                {
                                  ev.building.address
                                }
                              </div>
                            )
                            : null}
                        </TableCell>
                        <TableCell
                          className='met-b-cell'
                          style={{ width: '16%', borderRight: 0 }}
                        >
                          {ev.workspace !== null && ev.workspace !== undefined && ev.workspace?.name
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
                    )}
                  </Draggable>
                )) : (
                  <TableRow style={{ height: '48px' }}>
                    <TableCell colSpan={5} style={{ borderTop: '1px solid #e4e4e4' }} />
                  </TableRow>
                )}
              </TableBody>
            )}
          </Droppable>
          {/* <TableRow
            className='table-head-title'
            key={`all-event-row'-${Math.random()}`}
          /> */}
          <TableRow
            className='table-head-title'
            key={`all-event-row'-${Math.random()}`}
            style={{ marginTop: '1.7rem' }}
          >
            Later
          </TableRow>
          <Droppable droppableId='3'>
            {(provided): JSX.Element => (
              <TableBody ref={provided.innerRef}>
                {laterPriority.length > 0 ? laterPriority.map((ev, index) => (
                  <Draggable
                    key={ev.id}
                    draggableId={String(ev.id)}
                    index={index}
                  >
                    {(providedx, snapshot): JSX.Element => (
                      <TableRow
                        hover
                        key={`all-event-row'-${Math.random()}`}
                        ref={providedx.innerRef}
                        onClick={(): void => {
                          handleRowClick(ev);
                        }}
                        className={snapshot.isDragging ? 'event-list-drag' : ''}
                        {...providedx.draggableProps}
                      >
                        <TableCell
                          className='met-b-cell'
                          style={{ width: '44%', borderRight: 0 }}
                        >
                          {' '}
                          <div
                            className='event-name-cell handle'
                            {...providedx.dragHandleProps}
                          >
                            <DragIndicatorIcon />
                            {' '}
                            <p>
                              {' '}
                              {ev.title}
                              {' '}
                            </p>
                            {' '}
                          </div>
                          {' '}
                        </TableCell>
                        <TableCell
                          className='met-b-cell'
                          style={{ width: '12%', borderLeft: '1px solid #e6e6e6' }}
                        >
                          <div style={{ background: optionsList.filter((item) => ev.status === item.value)[0].background, color: optionsList.filter((item) => ev.status === item.value)[0].color }} className='single-tag'>
                            {optionsList.filter((item) => ev.status === item.value)[0].name}
                          </div>
                        </TableCell>
                        <TableCell
                          className='met-b-cell'
                          style={{ width: '12%' }}
                        >
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
                              : ev.due_date}
                          </span>
                        </TableCell>
                        <TableCell
                          className='met-b-cell'
                          style={{ width: '16%' }}
                        >
                          { ev.building !== null && ev.building !== undefined && ev.building.address
                            ? (
                              <div className='building-cell'>
                                {
                                  ev.building.address
                                }
                              </div>
                            )
                            : null}
                        </TableCell>
                        <TableCell
                          className='met-b-cell'
                          style={{ width: '16%', borderRight: 0 }}
                        >
                          {ev.workspace !== null && ev.workspace !== undefined && ev.workspace?.name
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
                    )}
                  </Draggable>
                )) : (
                  <TableRow style={{ height: '48px' }}>
                    <TableCell colSpan={5} style={{ borderTop: '1px solid #e4e4e4' }} />
                  </TableRow>
                )}
              </TableBody>
            )}
          </Droppable>
          {/* <TableRow
            className='table-head-title'
            key={`all-event-row'-${Math.random()}`}
          /> */}
        </Table>
      </DragDropContext>
    </div>
  );
}
