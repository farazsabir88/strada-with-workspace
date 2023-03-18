import { Checkbox, Popover, InputBase } from '@mui/material';
import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import SearchIcon from '@mui/icons-material/Search';
import FilterButton from './FilterButton';
import type { IStatusFilter } from '../types';

interface IOptions {
  name: string;
  id: number;
  color?: string;
  background?: string;
}

const optionsList = [
  {
    name: 'Not Started',
    id: 1,
    color: 'rgba(33, 33, 33, 0.6)',
    background: 'rgba(0, 0, 0, 0.08)',
  },
  {
    name: 'In Process',
    id: 2,
    color: 'rgba(249, 168, 37, 0.87)',
    background: 'rgba(249, 168, 37, 0.08)',
  },
  {
    name: 'Scheduled',
    id: 3,
    color: 'rgba(33, 150, 243, 0.87)',
    background: 'rgba(33, 150, 243, 0.08)',
  },
  {
    name: 'Completed',
    id: 4,
    color: 'rgb(76, 175, 80)',
    background: 'rgba(76, 175, 80, 0.08)',
  },
  {
    name: 'As Needed',
    id: 5,
    color: 'rgb(0, 172, 193)',
    background: 'rgba(0, 172, 193, 0.08)',
  },
  {
    name: 'Contingency',
    id: 6,
    color: 'rgb(216, 27, 96)',
    background: 'rgba(216, 27, 96, 0.08)',
  },
  {
    name: 'Contract',
    id: 7,
    color: 'rgb(94, 53, 177)',
    background: 'rgba(94, 53, 177, 0.08)',
  },
];

export default function StatusFilter(props: IStatusFilter): JSX.Element {
  const [search, setSearch] = useState<string>('');
  const [menuOptions, setMenuOptions] = useState<IOptions[]>(optionsList);
  const { setStatusFilter, statusFilter } = props;

  const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>): void => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (): void => {
    setAnchorEl(null);
  };
  const handleChange = (changeId: number): void => {
    if (_.includes(statusFilter, changeId)) {
      const newIds = _.reject(statusFilter, (val: number) => val === changeId);
      setStatusFilter(newIds);
    } else {
      const newIds = [...statusFilter, changeId];
      setStatusFilter(newIds);
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
    setStatusFilter([]);
  };

  return (
    <div>
      <FilterButton
        text='Status'
        onClick={handleClick}
        options={menuOptions}
        selectedOptions={statusFilter}
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
                checked={_.includes(statusFilter, option.id)}
                onChange={(): void => {
                  handleChange(option.id);
                }}
              />
              <div
                style={{ background: option.background, color: option.color }}
                // className='name-side-colored'
                className='single-tag-global'
              >
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
