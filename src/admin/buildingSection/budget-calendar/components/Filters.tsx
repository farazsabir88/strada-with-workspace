/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import React from 'react';
import BuildingFilter from 'admin/buildingSection/budget-calendar/components/BuildingFilter';
import StradaSearch from './StradaSearch';
import type { IFilters } from '../types';
import AssigneeFilter from './AssigneeFilter';
import OccurrenceFilter from './OccurrenceFilter';
import MovedFilter from './MovedFilter';
import CreatedFilters from './CreatedFilters';
import ProjectFilters from './ProjectsFilter';
import StatusFilter from './StatusFilter';
import MonthFilter from './MonthFilter';

export default function Filters(props: IFilters): JSX.Element {
  const {
    search,
    setSearch,
    assignees,
    setAssignees,
    occurrences,
    setOccurrences,
    moves,
    setMoves,
    createdFilters,
    setCreatedFilters,
    projectFiltrs,
    setProjectFilters,
    statusFilter,
    setStatusFilter,
    monthFilter,
    setMonthFilter,
    handleResetFilters,
    propertyFilter,
    setPropertyFilter,
  } = props;
  return (
    <div className='bc-filter-main-wrapper'>
      <div className='bc-filters-wrapper'>
        <StradaSearch
          value={search}
          setSearch={setSearch}
          placeholder='Search'
        />
        <StatusFilter
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />

        { propertyFilter !== undefined && (
          <BuildingFilter
            buildingFilter={propertyFilter}
            setBuildingFilter={setPropertyFilter}
          />
        ) }
        {monthFilter !== undefined
        && (
          <MonthFilter
            monthFilter={monthFilter}
            setMonthFilter={setMonthFilter}
          />
        ) }
        <AssigneeFilter assignees={assignees} setAssignees={setAssignees} />
        <OccurrenceFilter
          occurrences={occurrences}
          setOccurrences={setOccurrences}
        />
        <MovedFilter moves={moves} setMoves={setMoves} />
        <CreatedFilters
          createdFilters={createdFilters}
          setCreatedFilters={setCreatedFilters}
        />
        <ProjectFilters
          projectFiltrs={projectFiltrs}
          setProjectFilters={setProjectFilters}
        />
        <h6 onClick={handleResetFilters} aria-hidden='true'> Reset </h6>
      </div>
    </div>
  );
}
