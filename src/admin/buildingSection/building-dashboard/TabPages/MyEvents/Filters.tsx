import React from 'react';
import ScrollContainer from 'react-indiana-drag-scroll';
import WorkspaceFilter from 'admin/buildingSection/budget-calendar/components/WorkspaceFilter';
import BuildingFilter from 'admin/buildingSection/budget-calendar/components/BuildingFilter';
import type { IFilters } from './types';

export default function Filters(props: IFilters): JSX.Element {
  const {
    workspaceFilter,
    setWorkspaceFilter,
    buildingFilter,
    setBuildingFilter,

  } = props;
  return (
    <ScrollContainer className='scroll-container'>
      <div className='bc-filter-main-wrapper' style={{ width: '100%' }}>
        <div className='bc-filters-wrapper'>
          <WorkspaceFilter workspaceFilter={workspaceFilter} setWorkspaceFilter={setWorkspaceFilter} />
          <BuildingFilter buildingFilter={buildingFilter} setBuildingFilter={setBuildingFilter} />
        </div>
      </div>
    </ScrollContainer>
  );
}
