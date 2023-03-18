import { IconButton, InputBase, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import React, { useState, useEffect } from 'react';
import type { KeyboardEvent } from 'react';

interface SearchProps {
  value: string;
  placeholder: string;
  setSearch: (text: string) => void;
  className?: string;
}

export default function StradaSearch(props: SearchProps): JSX.Element {
  const {
    value, placeholder, setSearch, className,
  } = props;
  const [inputText, setInputText] = useState('');
  const handleSearch: (e: KeyboardEvent<HTMLImageElement>) => void = (e: KeyboardEvent<HTMLImageElement>) => {
    if (e.key === 'Enter') {
      setSearch(inputText);
    }
  };

  useEffect(() => {
    setInputText(value);
  }, [value]);

  return (
    <Paper elevation={0} className={`${className} strada-search-paper`}>
      <InputBase
        value={inputText}
        className='w-100'
        onChange={(e): void => { setSearch(e.target.value); }}
        onBlur={(): void => { setSearch(inputText); }}
        onKeyPress={handleSearch}
        placeholder={placeholder}
        startAdornment={(
          // <IconButton style={{ padding: 0 }} onClick={(): void => { setSearch(inputText); }}>
          <IconButton style={{ padding: 0 }}>

            {' '}
            <SearchIcon style={{ color: '#212121A0' }} className='bc-search-icon' />
            {' '}
          </IconButton>
        )}
      />

      {' '}
    </Paper>
  );
}

StradaSearch.defaultProps = {
  className: '',
};
