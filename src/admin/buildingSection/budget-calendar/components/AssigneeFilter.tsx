/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Avatar, Checkbox, Popover, InputBase,
} from '@mui/material';
import type { AxiosResponse } from 'axios';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import _ from 'lodash';
import {
  useLocation,
} from 'react-router-dom';
import type { RootState } from 'mainStore';
import { useSelector } from 'react-redux';
import SearchIcon from '@mui/icons-material/Search';
import type { IAssigneeFilterResponse } from 'admin/buildingSettings/people/types';
import type { IAssigneeFilters } from 'admin/buildingSection/budget-calendar/types';
import FilterButton from './FilterButton';

// import type { IAssigneeFilters } from '../types';

interface IOptions {
  name: string;
  value: number;
  avatar: string | null;
}

export default function AssigneeFilter(props: IAssigneeFilters): JSX.Element {
  const location = useLocation();
  const currentWorkspace = useSelector(
    (state: RootState) => state.workspaces.currentWorkspace.currentWorkspace,
  );
  const [search, setSearch] = useState<string>('');
  const [menuOptions, setOptions] = useState<IOptions[]>([]);
  const { assignees, setAssignees } = props;

  let newUrl = `/api/filter/assignee/?workspace=${currentWorkspace.id}`;
  if (location.pathname.includes('/dashboard')) {
    newUrl = '/api/filter/assignee/';
  }

  const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>): void => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (): void => {
    setAnchorEl(null);
  };

  const handleChange = (id: number): void => {
    if (_.includes(assignees, id)) {
      const newIds = _.reject(assignees, (val: number) => val === id);
      setAssignees(newIds);
    } else {
      const newIds = [...assignees, id];
      setAssignees(newIds);
    }
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const { data: users = [] } = useQuery('get/people', async () => axios({
    url: newUrl,
    method: 'get',

  }), {
    select: (res: AxiosResponse<IAssigneeFilterResponse>) => {
      const options = res.data.detail.map((user) => ({
        name: user.name,
        value: user.id,
        avatar: user.avatar,
      }));

      return options;
    },
  });
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
    setAssignees([]);
  };

  return (
    <div>
      <FilterButton text='Assignee' onClick={handleClick} options={users.map((user) => ({ name: user.name, id: user.value }))} selectedOptions={assignees} resetSelected={resetSelected} />
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
              <Checkbox checked={_.includes(assignees, user.value)} onChange={(): void => { handleChange(user.value); }} />
              <div className='name-side'>
                <Avatar src={`${process.env.REACT_APP_IMAGE_URL}${user.avatar}`} style={{ width: '24px', height: '24px' }}>{user.name}</Avatar>
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
