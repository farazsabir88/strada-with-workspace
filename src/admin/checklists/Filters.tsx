import React from 'react';
import ScrollContainer from 'react-indiana-drag-scroll';
import AssigneeFilter from 'admin/buildingSection/budget-calendar/components/AssigneeFilter';
import DueDateRangeFilter from 'admin/buildingSection/budget-calendar/components/DueDateRangeFilter';
import ChecklistStatusFilter from 'admin/buildingSection/budget-calendar/components/ChecklistStatusFilter';
import BuildingFilter from 'admin/buildingSection/budget-calendar/components/BuildingFilter';
import TemplateFilter from 'admin/buildingSection/budget-calendar/components/TemplateFilter';
import TaskCompletedFilter from 'admin/buildingSection/budget-calendar/components/TaskCompletedFilter';
import type { IFilters } from './types';

export default function Filters(props: IFilters): JSX.Element {
  const {
    statusFilter,
    setStatusFilter,
    buildingFilter,
    setBuildingFilter,
    templateFilter,
    setTemplateFilter,
    assignees,
    setAssignees,
    taskCompletedType,
    setTaskCompletedType,
    taskCompletedValue,
    setTaskCompletedValue,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
  } = props;
  return (
    <ScrollContainer className='scroll-container'>
      <div className='bc-filter-main-wrapper'>
        <div className='bc-filters-wrapper'>
          <ChecklistStatusFilter statusFilter={statusFilter} setStatusFilter={setStatusFilter} />
          <BuildingFilter buildingFilter={buildingFilter} setBuildingFilter={setBuildingFilter} />
          <TemplateFilter templateFilter={templateFilter} setTemplateFilter={setTemplateFilter} />
          <AssigneeFilter assignees={assignees} setAssignees={setAssignees} />
          <DueDateRangeFilter startDate={startDate} setStartDate={setStartDate} endDate={endDate} setEndDate={setEndDate} />
          <TaskCompletedFilter taskCompletedType={taskCompletedType} setTaskCompletedType={setTaskCompletedType} taskCompletedValue={taskCompletedValue} setTaskCompletedValue={setTaskCompletedValue} />
        </div>
      </div>
    </ScrollContainer>
  );
}
