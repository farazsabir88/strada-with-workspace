/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Checkbox, Popover, InputBase } from '@mui/material';
import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import SearchIcon from '@mui/icons-material/Search';
import { useQuery } from 'react-query';
// import { useParams } from 'react-router-dom';
import type { AxiosResponse } from 'axios';
import axios from 'axios';
// import { decrypt } from 'shared-components/hooks/useEncryption';
import type { IProjectsFilters } from '../types';
// eslint-disable-next-line import/no-named-as-default
import FilterButton from './FilterButton';

interface IOptions {
  name: string;
  id: number;
}

interface IOptionsResponse {
  message: string;
  detail: IOptions[];
  success: boolean;
}

export default function ProjectFilters(props: IProjectsFilters): JSX.Element {
  const [search, setSearch] = useState<string>('');
  const [menuOptions, setMenuOptions] = useState<IOptions[]>([]);
  const { projectFiltrs, setProjectFilters } = props;

  const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>): void => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (): void => {
    setAnchorEl(null);
  };

  const { data: optionsList = [] } = useQuery('get/tags-filters', async () => axios({
    url: '/api/filter/tag/',
    method: 'GET',
  }), {
    select: (res: AxiosResponse<IOptionsResponse>) => res.data.detail,
  });

  const handleChange = (id: number): void => {
    if (_.includes(projectFiltrs, id)) {
      const newIds = _.reject(projectFiltrs, (val: number) => val === id);
      setProjectFilters(newIds);
    } else {
      const newIds = [...projectFiltrs, id];
      setProjectFilters(newIds);
    }
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  const handleSearch = (): void => {
    const newOptions = optionsList.filter((option) => option.name.toUpperCase().includes(search.toUpperCase()));
    setMenuOptions(newOptions);
  };

  useEffect(() => {
    handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [optionsList, search]);

  const resetOccurrences = (event: React.ChangeEvent): void => {
    event.stopPropagation();
    setAnchorEl(null);
    setProjectFilters([]);
  };

  return (
    <div>
      <FilterButton
        text='Projects'
        onClick={handleClick}
        options={menuOptions}
        selectedOptions={projectFiltrs}
        resetSelected={resetOccurrences}
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
            <div className='single-option' key={option.name}>
              <Checkbox
                checked={_.includes(projectFiltrs, option.id)}
                onChange={(): void => {
                  handleChange(option.id);
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
