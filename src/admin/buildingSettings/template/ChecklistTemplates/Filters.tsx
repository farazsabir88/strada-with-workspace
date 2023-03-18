import React from 'react';
import ScrollContainer from 'react-indiana-drag-scroll';
import AssigneeFilter from 'admin/buildingSection/budget-calendar/components/AssigneeFilter';
import AuthorFilter from 'admin/buildingSection/budget-calendar/components/AuthorFilter';
import DateRangeFilter from 'admin/buildingSection/budget-calendar/components/DateRangeFilter';
import type { IFilters } from './types';

export default function Filters(props: IFilters): JSX.Element {
  const {
    assignees,
    setAssignees,
    author,
    setAuthor,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
  } = props;
  return (
    <ScrollContainer className='scroll-container'>
      <div className='bc-filter-main-wrapper'>
        <div className='bc-filters-wrapper'>
          <AssigneeFilter assignees={assignees} setAssignees={setAssignees} />
          <AuthorFilter author={author} setAuthor={setAuthor} />
          <DateRangeFilter startDate={startDate} setStartDate={setStartDate} endDate={endDate} setEndDate={setEndDate} />
        </div>
      </div>
    </ScrollContainer>
  );
}
