/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Checkbox, Popover, InputBase } from '@mui/material';
import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import SearchIcon from '@mui/icons-material/Search';
import FilterButton from './FilterButton';
import type { ISetOccurrences } from '../types';

interface IOptions {
  name: string;
  id: number;
}

const optionsList = [
  {
    name: 'Monthly',
    id: 1,
  },
  {
    name: 'Semi-Annual',
    id: 2,
  },
  {
    name: 'Quarterly',
    id: 3,
  },
  {
    name: 'Non-recurring',
    id: 4,
  },
  {
    name: 'Annual',
    id: 5,
  },
];

export default function OccurrenceFilter(props: ISetOccurrences): JSX.Element {
  const [search, setSearch] = useState<string>('');
  const [menuOptions, setMenuOptions] = useState<IOptions[]>(optionsList);
  const { occurrences, setOccurrences } = props;

  const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>): void => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (): void => {
    setAnchorEl(null);
  };

  const handleChange = (id: number): void => {
    if (_.includes(occurrences, id)) {
      const newIds = _.reject(occurrences, (val: number) => val === id);
      setOccurrences(newIds);
    } else {
      const newIds = [...occurrences, id];
      setOccurrences(newIds);
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
    setOccurrences([]);
  };

  return (
    <div>
      <FilterButton text='Occurrence' onClick={handleClick} options={menuOptions} selectedOptions={occurrences} resetSelected={resetOccurrences} />
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

          {menuOptions.map((option) => (
            <div className='single-option' key={option.name}>
              <Checkbox checked={_.includes(occurrences, option.id)} onChange={(): void => { handleChange(option.id); }} />
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
