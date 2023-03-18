import { Checkbox, Popover, InputBase } from '@mui/material';
import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import SearchIcon from '@mui/icons-material/Search';
import FilterButton from './FilterButton';
import type { IMovesFilter } from '../types';

interface IOptions {
  name: string;
  id: number;
}

const optionsList = [
  {
    name: 'Moved To',
    id: 1,
  },
  {
    name: 'Moved From',
    id: 2,
  },
];

export default function MovedFilter(props: IMovesFilter): JSX.Element {
  const [search, setSearch] = useState<string>('');
  const [menuOptions, setMenuOptions] = useState<IOptions[]>(optionsList);
  const {
    moves, setMoves,
  } = props;

  const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>): void => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (): void => {
    setAnchorEl(null);
  };

  const handleChange = (id: number): void => {
    if (_.includes(moves, id)) {
      const newIds = _.reject(moves, (val: number) => val === id);
      setMoves(newIds);
    } else {
      const newIds = [...moves, id];
      setMoves(newIds);
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
    setMoves([]);
  };

  return (
    <div>
      <FilterButton text='Moved' onClick={handleClick} options={menuOptions} selectedOptions={moves} resetSelected={resetOccurrences} />
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
              <Checkbox checked={_.includes(moves, option.id)} onChange={(): void => { handleChange(option.id); }} />
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
