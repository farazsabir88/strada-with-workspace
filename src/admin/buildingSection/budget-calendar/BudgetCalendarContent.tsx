/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import type { AxiosResponse } from 'axios';
import axios from 'axios';
import moment from 'moment';
import './_budget-calendar.scss';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import type { RootState } from 'mainStore';
import StradaLoader from 'shared-components/components/StradaLoader';
import makeStyles from '@mui/styles/makeStyles';
import Header from './components/Header';
import Filters from './components/Filters';
import TableSection from './components/TableSection';
import type { IEventResponse } from './types';

const useStyles = makeStyles({
  parent: {},
  backdrop: {},
});

export default function BudgetCalendarContent(): JSX.Element {
  const { buildingId } = useParams();
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const currentWorkspace = useSelector((state: RootState) => state.workspaces.currentWorkspace.currentWorkspace);
  const [date, setDate] = useState<Date | null>(new Date());
  const [dateYear, setDateYear] = useState<string>('');
  const [yearly, setYearly] = useState(false);
  const [search, setSearch] = useState< string>('');
  const [assignees, setAssignees] = useState<number[]>([]);
  const [occurrences, setOccurrences] = useState<number[]>([]);
  const [moves, setMoves] = useState<number[]>([]);
  const [createdFilters, setCreatedFilters] = useState<number[]>([]);
  const [projectFiltrs, setProjectFilters] = useState<number[]>([]);
  const [statusFilter, setStatusFilter] = useState<number[]>([]);
  const [newEventOpen, setNewEventOpen] = useState<boolean>(false);
  const [propertyFilter, setPropertyFilter] = useState<number[]>([]);

  // functions
  const handleResetFilters = (): void => {
    setDate(new Date());
    setDateYear('');
    setSearch('');
    setAssignees([]);
    setOccurrences([]);
    setMoves([]);
    setCreatedFilters([]);
    setProjectFilters([]);
    setStatusFilter([]);
    setPropertyFilter([]);
  };

  const { data: events = [], refetch } = useQuery(['sidesheet/get-events', date, dateYear, yearly, search, statusFilter, assignees, occurrences, createdFilters, projectFiltrs, propertyFilter], async () => axios({
    url: '/api/budget-calendar/event/',
    method: 'GET',
    params: {
      workspace: Number(currentWorkspace.id),
      date: date !== null ? moment(date).format('YYYY-MM-DD') : '',
      year: dateYear,
      search,
      status: statusFilter,
      assignee: assignees,
      occurrence: occurrences,
      is_annual_budget_event: createdFilters,
      tag: projectFiltrs,
      property: propertyFilter,
    },
  }), {
    select: (res: AxiosResponse<IEventResponse>) => res.data.detail,
  });

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (buildingId !== null) {
      refetch().catch((e) => { throw e; });
    }
  }, [buildingId]);

  const { mutate: createEvent } = useMutation(async (title: string) => axios({
    url: '/api/budget-calendar/event/',
    method: 'POST',
    data: {
      date: date !== null ? moment(date).format('YYYY-MM-DD') : `${dateYear}-${new Date().getMonth() + 1}-${new Date().getDate()}`,
      month: date !== null ? date.getMonth() + 1 : new Date().getMonth() + 1,
      workspace: Number(currentWorkspace.id),
      title,
    },
  }), {
    onSuccess: async (): Promise<void> => {
      await queryClient.invalidateQueries('sidesheet/get-events')
        .then();
      enqueueSnackbar('Event created successfully');
    },
  });
  return (
    <div className={`bc-container ${classes.parent}`}>
      <StradaLoader open={false} className={classes.backdrop} />
      <Header
        setDate={setDate}
        date={date}
        dateYear={dateYear}
        setDateYear={setDateYear}
        setYearly={setYearly}
        setNewEventOpen={setNewEventOpen}

      />
      <Filters
        search={search}
        setSearch={setSearch}
        assignees={assignees}
        setAssignees={setAssignees}
        occurrences={occurrences}
        setOccurrences={setOccurrences}
        moves={moves}
        setMoves={setMoves}
        createdFilters={createdFilters}
        setCreatedFilters={setCreatedFilters}
        projectFiltrs={projectFiltrs}
        setProjectFilters={setProjectFilters}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        handleResetFilters={handleResetFilters}
        propertyFilter={propertyFilter}
        setPropertyFilter={setPropertyFilter}
      />
      <TableSection events={events} newEventOpen={newEventOpen} setNewEventOpen={setNewEventOpen} createEvent={createEvent} setDate={setDate} dateYear={dateYear} />
    </div>

  );
}
