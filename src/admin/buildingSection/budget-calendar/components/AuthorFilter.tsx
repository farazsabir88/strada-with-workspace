/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Avatar, Checkbox, Popover, InputBase,
} from '@mui/material';
import type { AxiosResponse } from 'axios';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import _ from 'lodash';
import SearchIcon from '@mui/icons-material/Search';
import { useSelector } from 'react-redux';
import type { RootState } from 'mainStore';
import type { IPeopleResponse } from 'admin/buildingSettings/people/types';
import type { IAuthorFilters } from 'admin/buildingSettings/template/ChecklistTemplates/types';
import FilterButton from './FilterButton';
// import type { IAssigneeFilters } from '../types';

interface IOptions {
  name: string;
  value: number;
  avatar: string | null;
}

export default function AuthorFilter(props: IAuthorFilters): JSX.Element {
  const currentWorkspace = useSelector((state: RootState) => state.workspaces.currentWorkspace.currentWorkspace);
  const [search, setSearch] = useState<string>('');
  const [menuOptions, setOptions] = useState<IOptions[]>([]);
  const { author, setAuthor } = props;

  const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>): void => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (): void => {
    setAnchorEl(null);
  };

  const handleChange = (id: number): void => {
    if (_.includes(author, id)) {
      const newIds = _.reject(author, (val: number) => val === id);
      setAuthor(newIds);
    } else {
      const newIds = [...author, id];
      setAuthor(newIds);
    }
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const { data: users = [] } = useQuery('get/people', async () => axios({
    url: '/api/filter/assignee/',
    params: {
      workspace: currentWorkspace.id,
    },
    method: 'get',

  }), {
    select: (res: AxiosResponse<IPeopleResponse>) => {
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
    setAuthor([]);
  };

  return (
    <div>
      <FilterButton text='Author' onClick={handleClick} options={users.map((user) => ({ name: user.name, id: user.value }))} selectedOptions={author} resetSelected={resetSelected} />
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
              <Checkbox checked={_.includes(author, user.value)} onChange={(): void => { handleChange(user.value); }} />
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
