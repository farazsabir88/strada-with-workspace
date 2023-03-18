/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Checkbox, Popover, InputBase } from '@mui/material';
import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import SearchIcon from '@mui/icons-material/Search';
import FilterButton from './FilterButton';
import type { IMonthFilter } from '../types';

interface IOptions {
  name: string;
  id: number;
  color?: string;
  background?: string;
}

const optionsList = [
  {
    name: 'January',
    id: 1,
  },
  {
    name: 'February',
    id: 2,
  },
  {
    name: 'March',
    id: 3,
  },
  {
    name: 'April',
    id: 4,
  },
  {
    name: 'May',
    id: 5,
  },
  {
    name: 'June',
    id: 6,
  },
  {
    name: 'July',
    id: 7,
  },
  {
    name: 'August',
    id: 8,
  },
  {
    name: 'September',
    id: 9,
  },
  {
    name: 'October',
    id: 10,
  },
  {
    name: 'November',
    id: 11,
  },
  {
    name: 'December',
    id: 12,
  },
];

export default function MonthFilter(props: IMonthFilter): JSX.Element {
  const [search, setSearch] = useState<string>('');
  const [menuOptions, setMenuOptions] = useState<IOptions[]>(optionsList);
  const { setMonthFilter, monthFilter } = props;

  const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>): void => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (): void => {
    setAnchorEl(null);
  };
  const handleChange = (changeId: number): void => {
    if (_.includes(monthFilter, changeId)) {
      const newIds = _.reject(monthFilter, (val: number) => val === changeId);
      setMonthFilter(newIds);
    } else {
      const newIds = [...monthFilter, changeId];
      setMonthFilter(newIds);
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

  const resetOccurrences = (): void => {
    setMonthFilter([]);
  };

  return (
    <div>
      <FilterButton
        text='Month'
        onClick={handleClick}
        options={menuOptions}
        selectedOptions={monthFilter}
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
                checked={_.includes(monthFilter, option.id)}
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
