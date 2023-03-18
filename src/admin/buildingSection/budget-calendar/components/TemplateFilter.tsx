/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Checkbox, Popover, InputBase } from '@mui/material';
import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import {
  useLocation,
} from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import { useQuery } from 'react-query';
import type { AxiosResponse } from 'axios';
import axios from 'axios';
import { useSelector } from 'react-redux';
import type { RootState } from 'mainStore';
import type { ITemplateFilter } from '../types';
import type { ITemplateFilterResponse } from '../../../checklists/types';
import FilterButton from './FilterButton';

interface IOptions {
  name: string;
  value: number;
}

export default function TemplateFilter(props: ITemplateFilter): JSX.Element {
  const location = useLocation();
  const [search, setSearch] = useState<string>('');
  const [menuOptions, setOptions] = useState<IOptions[]>([]);
  const { templateFilter, setTemplateFilter } = props;
  const currentWorkspace = useSelector((state: RootState) => state.workspaces.currentWorkspace.currentWorkspace);

  const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null);
  let newUrl = `/api/filter/checklist-template/?workspace=${currentWorkspace.id}`;
  if (location.pathname.includes('/dashboard')) {
    newUrl = '/api/filter/checklist-template/';
  }

  const { data: users = [] } = useQuery('get/checklist-template', async () => axios({
    url: newUrl,
    method: 'GET',
  }), {
    select: (res: AxiosResponse<ITemplateFilterResponse>) => {
      const options = res.data.detail.map((user) => ({
        name: user.template_name,
        value: user.id,
      }));

      return options;
    },
  });

  const handleClick = (event: React.MouseEvent<HTMLDivElement>): void => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (): void => {
    setAnchorEl(null);
  };

  const handleChange = (id: number): void => {
    if (_.includes(templateFilter, id)) {
      const newIds = _.reject(templateFilter, (val: number) => val === id);
      setTemplateFilter(newIds);
    } else {
      const newIds = [...templateFilter, id];
      setTemplateFilter(newIds);
    }
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
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
    setTemplateFilter([]);
  };

  return (
    <div>
      <FilterButton
        text='Template'
        onClick={handleClick}
        options={users.map((user) => ({ name: user.name, id: user.value }))}
        selectedOptions={templateFilter}
        resetSelected={resetSelected}
      />
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
            <InputBase
              className='search-input'
              value={search}
              onChange={(e): void => {
                setSearch(e.target.value);
              }}
              placeholder='Search'
            />
            <SearchIcon fontSize='small' color='disabled' />
          </div>
          <div className='search-underline' />

          {menuOptions.map((option) => (
            <div className='single-option' key={option.value}>
              <Checkbox
                checked={_.includes(templateFilter, option.value)}
                onChange={(): void => {
                  handleChange(option.value);
                }}
              />
              <div className='name-side'>
                <p>
                  {' '}
                  {option.name}
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
