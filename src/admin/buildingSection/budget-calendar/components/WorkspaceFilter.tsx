/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  Checkbox, Popover, InputBase,
} from '@mui/material';
import type { AxiosResponse } from 'axios';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import _ from 'lodash';
import SearchIcon from '@mui/icons-material/Search';
import type { IWorkspaceFilters } from 'admin/buildingSection/budget-calendar/types';
import type { WorkspacesResponse } from '../../building-dashboard/types';
import FilterButton from './FilterButton';

// import type { IAssigneeFilters } from '../types';

interface IOptions {
  name: string;
  value: number;
}

export default function WorkspaceFilter(props: IWorkspaceFilters): JSX.Element {
  const [search, setSearch] = useState<string>('');
  const [menuOptions, setOptions] = useState<IOptions[]>([]);
  const { workspaceFilter, setWorkspaceFilter } = props;

  const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>): void => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (): void => {
    setAnchorEl(null);
  };

  const handleChange = (id: number): void => {
    if (_.includes(workspaceFilter, id)) {
      const newIds = _.reject(workspaceFilter, (val: number) => val === id);
      setWorkspaceFilter(newIds);
    } else {
      const newIds = [...workspaceFilter, id];
      setWorkspaceFilter(newIds);
    }
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const { data: users = [] } = useQuery(
    ['get/filter/workspace'],
    async () => axios({
      url: '/api/filter/workspace/',
      method: 'get',
    }),
    {
      select: (res: AxiosResponse<WorkspacesResponse>) => {
        const options = res.data.detail.map((workspace) => ({
          name: workspace.name,
          value: workspace.id,
        }));

        return options;
      },
    },
  );

  const handleSearch = (): void => {
    const newOptions = users.filter((option) => option.name.toUpperCase().includes(search.toUpperCase()));
    setOptions(newOptions);
  };

  useEffect(() => {
    setOptions(users);
    handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users, search]);

  const resetSelected = (event: React.ChangeEvent): void => {
    event.stopPropagation();
    setAnchorEl(null);
    setWorkspaceFilter([]);
  };
  return (
    <div>
      <FilterButton text='Workspace' onClick={handleClick} options={users.map((user) => ({ name: user.name, id: user.value }))} selectedOptions={workspaceFilter} resetSelected={resetSelected} />
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <div className='filter-popover'>
          <div className='search-wrapper'>
            <InputBase className='search-input' value={search} onChange={(e): void => { setSearch(e.target.value); }} placeholder='Search' />
            <SearchIcon fontSize='small' color='disabled' />
          </div>
          <div className='search-underline' />

          {menuOptions.map((user) => (
            <div className='single-option' key={`${user.name}`}>
              <Checkbox checked={_.includes(workspaceFilter, user.value)} onChange={(): void => { handleChange(user.value); }} />
              <div className='name-side'>
                <p>
                  {' '}
                  {user.name}
                  {' '}
                </p>
              </div>
            </div>
          ))}

        </div>
      </Popover>
    </div>
  );
}
