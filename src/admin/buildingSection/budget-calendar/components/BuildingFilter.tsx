/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Checkbox, Popover, InputBase,
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
import type { IBuildingFilters } from 'admin/buildingSection/budget-calendar/types';
import type { BuildingsResponse } from '../../building-dashboard/types';
import FilterButton from './FilterButton';

// import type { IAssigneeFilters } from '../types';

interface IOptions {
  name: string;
  value: number;
}

export default function BuildingFilter(props: IBuildingFilters): JSX.Element {
  const location = useLocation();
  const currentWorkspace = useSelector((state: RootState) => state.workspaces.currentWorkspace.currentWorkspace);
  const [search, setSearch] = useState<string>('');
  const [menuOptions, setOptions] = useState<IOptions[]>([]);
  const { buildingFilter, setBuildingFilter } = props;

  let newUrl = `api/filter/property/?workspace=${currentWorkspace.id}`;
  if (location.pathname.includes('/dashboard')) {
    newUrl = 'api/filter/property/';
  }

  const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>): void => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (): void => {
    setAnchorEl(null);
  };

  const handleChange = (id: number): void => {
    if (_.includes(buildingFilter, id)) {
      const newIds = _.reject(buildingFilter, (val: number) => val === id);
      setBuildingFilter(newIds);
    } else {
      const newIds = [...buildingFilter, id];
      setBuildingFilter(newIds);
    }
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const { data: users = [] } = useQuery(
    ['get/buildings'],
    async () => axios({
      url: newUrl,
      method: 'get',
    }),
    {
      select: (res: AxiosResponse<BuildingsResponse>) => {
        const options = res.data.detail.map((user) => ({
          name: user.address,
          value: user.id,
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
    setBuildingFilter([]);
  };

  return (
    <div>
      <FilterButton text='Property' onClick={handleClick} options={users.map((user) => ({ name: user.name, id: user.value }))} selectedOptions={buildingFilter} resetSelected={resetSelected} />
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
              <Checkbox checked={_.includes(buildingFilter, user.value)} onChange={(): void => { handleChange(user.value); }} />
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
